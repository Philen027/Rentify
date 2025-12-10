document.addEventListener("DOMContentLoaded", () => {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const helpers = window.firebaseHelpers;
    const storage = window.firebaseStorage;
    let currentUser = null;

    // 1. AUTH LISTENER
    helpers.onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "loginpage.html";
            return;
        }
        currentUser = user;
        checkVerificationStatus();
    });

    // 2. GATEKEEPER LOGIC (Fixes the "Stuck" Error)
    async function checkVerificationStatus() {
        try {
            // Fetch Partner Profile
            const docRef = helpers.doc(db, "partners", currentUser.uid);
            const snap = await helpers.getDoc(docRef);
            
            // Hide the initial loader
            document.getElementById('state-loading').classList.add('hidden-force');

            let status = 'new';
            if (snap.exists()) {
                status = snap.data().verificationStatus || 'new';
            }

            console.log("Current User Status:", status);

            if (status === 'approved') {
                // --- SHOW MAIN DASHBOARD ---
                // Switch Body Classes (Video Mode -> Dashboard Mode)
                const body = document.getElementById('main-body');
                body.classList.remove('bg-video-mode');
                body.classList.add('bg-dashboard-mode');
                body.style.overflow = "hidden"; // Prevent double scrollbars

                // Hide Verification View
                document.getElementById('view-verification').classList.add('hidden-force');
                
                // Show Dashboard View
                document.getElementById('view-dashboard').classList.remove('hidden-force');

                // Initialize Dashboard Data
                if(snap.exists()) {
                    const planName = (snap.data().plan || "FREE").toUpperCase();
                    document.getElementById("plan-badge").textContent = planName;
                }
                startRealTimeDashboard();
                loadProductsTab();

            } else if (status === 'submitted') {
                // --- SHOW PENDING SCREEN ---
                document.getElementById('state-pending').classList.remove('hidden-force');
                document.getElementById('state-form').classList.add('hidden-force');

            } else {
                // --- SHOW APPLICATION FORM (New/Rejected) ---
                document.getElementById('state-form').classList.remove('hidden-force');
                document.getElementById('state-pending').classList.add('hidden-force');
            }

        } catch (error) {
            console.error("Verification Check Error:", error);
            // Fallback: Show form if something breaks so user isn't stuck
            document.getElementById('state-loading').classList.add('hidden-force');
            document.getElementById('state-form').classList.remove('hidden-force');
        }
    }

    // 3. HANDLE FORM SUBMISSION
    const formVerify = document.getElementById('form-verify');
    if (formVerify) {
        formVerify.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit-app');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Uploading...';
            btn.disabled = true;

            try {
                const file = document.getElementById('v-file-doc').files[0];
                if (!file) throw new Error("Please select an ID/License image.");

                // Upload to Firebase Storage
                // Using a safe filename to prevent errors
                const fileName = `verification_${currentUser.uid}_${Date.now()}`;
                const storageRef = helpers.ref(storage, `verification_docs/${currentUser.uid}/${fileName}`);
                
                await helpers.uploadBytes(storageRef, file);
                const downloadUrl = await helpers.getDownloadURL(storageRef);

                // Save Profile to Firestore
                await helpers.setDoc(helpers.doc(db, "partners", currentUser.uid), {
                    businessName: document.getElementById('v-biz-name').value,
                    businessAddress: document.getElementById('v-biz-addr').value,
                    verificationDoc: downloadUrl,
                    verificationStatus: 'submitted', // Crucial for Admin
                    email: currentUser.email,
                    submittedAt: helpers.serverTimestamp()
                }, { merge: true });

                alert("Application Submitted! Pending Admin Approval.");
                location.reload(); // Refresh to trigger "submitted" state

            } catch (err) {
                console.error(err);
                alert("Error: " + err.message);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // 4. DASHBOARD REAL-TIME STATS
    function startRealTimeDashboard() {
        // Bookings Listener
        const qBook = helpers.query(
            helpers.collection(db, "bookings"),
            helpers.where("partnerId", "==", currentUser.uid),
            helpers.orderBy("createdAt", "desc")
        );

        helpers.onSnapshot(qBook, (snap) => {
            let active = 0, pending = 0, earnings = 0;
            const list = document.getElementById('tracking-list');
            if(list) list.innerHTML = "";

            if(snap.empty && list) {
                list.innerHTML = '<div class="text-center py-10 text-gray-400 text-sm">No active orders found.</div>';
            }

            snap.forEach(doc => {
                const b = doc.data();
                const now = new Date();
                const end = b.endDate ? b.endDate.toDate() : now;

                // Calculate Stats
                if (b.status === 'active') {
                    active++;
                    if (now > end) pending++;
                }
                if (b.totalPrice) earnings += b.totalPrice;

                // Render List Items (only active ones for tracking)
                if (list && b.status === 'active') {
                    const item = document.createElement('div');
                    item.className = "p-3 mb-2 bg-white border border-gray-100 rounded-xl hover:border-green-500 cursor-pointer transition group";
                    item.innerHTML = `
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                ${b.customerName ? b.customerName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-gray-800 truncate">${b.productName}</p>
                                <p class="text-xs text-gray-500 truncate">${b.customerAddress || 'No Address'}</p>
                            </div>
                            <span class="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">LIVE</span>
                        </div>
                    `;
                    // Map Interaction Logic could go here
                    list.appendChild(item);
                }
            });

            // Update DOM Counters
            if(document.getElementById('stat-active')) document.getElementById('stat-active').textContent = active;
            if(document.getElementById('stat-pending')) document.getElementById('stat-pending').textContent = pending;
            if(document.getElementById('stat-earnings')) document.getElementById('stat-earnings').textContent = earnings.toLocaleString();
        });

        // Products Count Listener
        const qProd = helpers.query(helpers.collection(db, "products"), helpers.where("partnerId", "==", currentUser.uid));
        helpers.onSnapshot(qProd, (snap) => {
            if(document.getElementById('stat-products')) document.getElementById('stat-products').textContent = snap.size;
            loadProductsTab(snap);
        });
    }

    // 5. PRODUCTS TAB RENDERER
    function loadProductsTab(snap) {
        const grid = document.getElementById('products-grid');
        if(!grid) return;
        
        // If passed a snapshot directly (real-time)
        if(snap && snap.forEach) {
            grid.innerHTML = "";
            snap.forEach(doc => {
                const p = doc.data();
                renderProductCard(grid, p);
            });
        } 
        // Fallback fetch if needed (usually handled by snapshot above)
    }

    function renderProductCard(container, p) {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition flex flex-col">
                <div class="h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                    <img src="${p.imageUrl}" class="w-full h-full object-cover">
                </div>
                <h4 class="font-bold text-gray-800 text-sm mb-1">${p.name}</h4>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-xs text-gray-500 font-medium">₹${p.rentPerDay}/day</span>
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
            </div>
        `;
    }

    // 6. ADD PRODUCT LOGIC (Base64 for simplicity + Firebase)
    const formAdd = document.getElementById('form-add');
    if (formAdd) {
        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-publish');
            btn.innerHTML = 'Publishing...'; btn.disabled = true;

            try {
                const file = document.getElementById('inp-file').files[0];
                if (!file) throw new Error("Image required");

                // Compress Image
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (ev) => {
                        const img = new Image(); img.src = ev.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const maxWidth = 500;
                            const scale = maxWidth / img.width;
                            canvas.width = maxWidth;
                            canvas.height = img.height * scale;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                        }
                    }
                });

                await helpers.addDoc(helpers.collection(db, "products"), {
                    partnerId: currentUser.uid,
                    name: document.getElementById('inp-name').value,
                    rentPerDay: Number(document.getElementById('inp-price').value),
                    category: document.getElementById('inp-category').value,
                    description: document.getElementById('inp-desc').value,
                    imageUrl: base64,
                    status: "published",
                    createdAt: helpers.serverTimestamp(),
                    storeName: document.getElementById('v-biz-name') ? document.getElementById('v-biz-name').value : "Partner Store"
                });

                alert("Product Published!");
                closeAddModal();
                formAdd.reset();

            } catch (err) {
                alert("Error: " + err.message);
            } finally {
                btn.innerHTML = 'Publish Item'; btn.disabled = false;
            }
        });
    }

    // 7. UI HELPERS
    window.switchTab = (tab) => {
        ['overview', 'tracking', 'products', 'plans'].forEach(id => {
            document.getElementById(`tab-${id}`).classList.add('hidden');
            document.getElementById(`nav-${id}`).classList.remove('active', 'bg-[#064E3B]', 'text-white');
        });
        document.getElementById(`tab-${tab}`).classList.remove('hidden');
        document.getElementById(`nav-${tab}`).classList.add('active', 'bg-[#064E3B]', 'text-white');
    };

    window.openAddModal = () => document.getElementById('modal-add').classList.remove('hidden');
    window.closeAddModal = () => document.getElementById('modal-add').classList.add('hidden');

    const logout = () => helpers.signOut(auth).then(() => window.location.href = "loginpage.html");
    document.getElementById('btn-logout').addEventListener('click', logout);
    document.getElementById('btn-logout-verif')?.addEventListener('click', logout);
    document.getElementById('btn-logout-pending')?.addEventListener('click', logout);
});