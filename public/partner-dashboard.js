document.addEventListener("DOMContentLoaded", () => {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const helpers = window.firebaseHelpers;
    
    let currentUser = null;
    let activeBookingId = null; // For verification modal

    // --- 1. AUTH & INIT ---
    helpers.onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "loginpage.html";
            return;
        }
        currentUser = user;
        loadDashboard();
        loadTracking();
    });

    // --- 2. IMAGE COMPRESSOR (Fixes "Publishing..." stuck) ---
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 600; // Resize to max 600px width
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
                };
            };
        });
    };

    // --- 3. PUBLISH PRODUCT ---
    document.getElementById('form-add').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-publish');
        btn.innerHTML = "Processing...";
        btn.disabled = true;

        try {
            const file = document.getElementById('inp-file').files[0];
            if (!file) throw new Error("Image required");

            const base64 = await compressImage(file);

            await helpers.addDoc(helpers.collection(db, "products"), {
                partnerId: currentUser.uid,
                name: document.getElementById('inp-name').value,
                rentPerDay: Number(document.getElementById('inp-price').value),
                deposit: Number(document.getElementById('inp-deposit').value),
                description: document.getElementById('inp-desc').value,
                imageUrl: base64,
                status: "published",
                createdAt: helpers.serverTimestamp()
            });

            alert("Product Published!");
            closeAddModal();
            document.getElementById('form-add').reset();
            loadProductsTab(); // Refresh list

        } catch (err) {
            alert(err.message);
        } finally {
            btn.innerHTML = "Publish Product";
            btn.disabled = false;
        }
    });

    // --- 4. TRACKING SYSTEM ---
    async function loadTracking() {
        const list = document.getElementById('tracking-list');
        list.innerHTML = "";
        
        const q = helpers.query(
            helpers.collection(db, "bookings"),
            helpers.where("partnerId", "==", currentUser.uid),
            helpers.orderBy("createdAt", "desc")
        );

        const snap = await helpers.getDocs(q);
        
        let activeCount = 0;
        let pendingReturns = 0;

        if(snap.empty) {
            document.getElementById('empty-tracking').classList.remove('hidden');
            return;
        }

        snap.forEach(doc => {
            const b = doc.data();
            const today = new Date();
            const endDate = b.endDate ? b.endDate.toDate() : new Date();
            
            // Check for Alerts (Overdue)
            let isOverdue = false;
            if (b.status === 'active' && today > endDate) {
                isOverdue = true;
                document.getElementById('alert-badge').classList.remove('hidden');
                pendingReturns++;
            }
            if (b.status === 'active') activeCount++;

            const row = document.createElement('tr');
            row.className = "bg-white border-b hover:bg-slate-50";
            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-slate-900">${b.productName}</td>
                <td class="px-6 py-4 text-slate-500">
                    <div>${b.customerName || 'Customer'}</div>
                    <div class="text-xs text-slate-400">Paid Deposit: ₹${b.depositAmount}</div>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">
                    <div>Start: ${b.startDate ? b.startDate.toDate().toLocaleDateString() : '-'}</div>
                    <div class="${isOverdue ? 'text-red-600 font-bold' : ''}">End: ${endDate.toLocaleDateString()}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs font-bold 
                        ${b.status==='active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                        ${isOverdue ? 'OVERDUE' : b.status.toUpperCase()}
                    </span>
                </td>
                <td class="px-6 py-4">
                    ${b.status === 'active' ? 
                        `<button onclick="openVerifyModal('${doc.id}')" class="text-blue-600 hover:underline text-xs font-bold">
                            Verify Return
                        </button>` : 
                        `<span class="text-xs text-slate-400">Completed</span>`
                    }
                </td>
            `;
            list.appendChild(row);
        });

        // Update Stats
        document.getElementById('stat-active').textContent = activeCount;
        document.getElementById('stat-pending').textContent = pendingReturns;
    }

    // --- 5. DAMAGE VERIFICATION LOGIC ---
    window.openVerifyModal = (bookingId) => {
        activeBookingId = bookingId;
        document.getElementById('modal-verify').classList.remove('hidden');
    };

    window.processReturn = async (hasDamage) => {
        if(!activeBookingId) return;
        
        const note = document.getElementById('inp-damage-note').value;
        const file = document.getElementById('inp-verify-file').files[0];
        let proofImg = null;

        if (file) {
            proofImg = await compressImage(file);
        }

        const bookingRef = helpers.doc(db, "bookings", activeBookingId);
        
        await helpers.updateDoc(bookingRef, {
            status: hasDamage ? "disputed" : "completed",
            returnDate: helpers.serverTimestamp(),
            damageReported: hasDamage,
            damageNote: note,
            returnProofImage: proofImg
        });

        alert(hasDamage ? "Damage reported! Deposit held." : "Return verified! Deposit released.");
        document.getElementById('modal-verify').classList.add('hidden');
        loadTracking();
    };

    // --- UI HELPERS ---
    window.openAddModal = () => document.getElementById('modal-add').classList.remove('hidden');
    window.closeAddModal = () => document.getElementById('modal-add').classList.add('hidden');
    window.switchTab = (tab) => {
        ['overview', 'tracking', 'products'].forEach(t => {
            document.getElementById(`tab-${t}`).classList.add('hidden');
        });
        document.getElementById(`tab-${tab}`).classList.remove('hidden');
        if(tab === 'products') loadProductsTab();
    };

    // Simple product loader for 'Products' tab
    async function loadProductsTab() {
        const container = document.getElementById('tab-products');
        container.innerHTML = '<div class="loader"></div>';
        const q = helpers.query(helpers.collection(db, "products"), helpers.where("partnerId", "==", currentUser.uid));
        const snap = await helpers.getDocs(q);
        container.innerHTML = "";
        snap.forEach(doc => {
            const p = doc.data();
            container.innerHTML += `
                <div class="bg-white p-4 rounded-xl border shadow-sm">
                    <img src="${p.imageUrl}" class="w-full h-32 object-cover rounded-lg mb-2">
                    <h4 class="font-bold">${p.name}</h4>
                    <p class="text-sm text-slate-500">₹${p.rentPerDay}/day</p>
                </div>
            `;
        });
    }

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        helpers.signOut(auth).then(() => window.location.href = "loginpage.html");
    });
});