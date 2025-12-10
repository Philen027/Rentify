document.addEventListener("DOMContentLoaded", () => {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const helpers = window.firebaseHelpers;
    let selectedPartnerId = null;

    // Simple Admin Check (Replace with custom claims in production)
    helpers.onAuthStateChanged(auth, user => {
        if(!user || user.email !== "philenkuriakose027@gmail.com") {
             // alert("Access Denied. Admins only.");
             // window.location.href = "loginpage.html";
             // FOR TESTING: Comment out the redirection above to test without setting up a specific admin user yet.
             loadRequests();
        } else {
            loadRequests();
        }
    });

    function loadRequests() {
        const q = helpers.query(helpers.collection(db, "partners"), helpers.where("verificationStatus", "==", "submitted"));
        
        helpers.onSnapshot(q, snap => {
            const list = document.getElementById('requests-list');
            list.innerHTML = "";
            if(snap.empty) {
                list.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400">No pending requests.</td></tr>';
                return;
            }
            snap.forEach(doc => {
                const p = doc.data();
                list.innerHTML += `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="p-4 font-bold">${p.businessName || 'N/A'}</td>
                        <td class="p-4 text-sm">${p.email}</td>
                        <td class="p-4 text-sm text-slate-500">${p.submittedAt ? p.submittedAt.toDate().toLocaleDateString() : '-'}</td>
                        <td class="p-4">
                            <button onclick="openReviewModal('${doc.id}')" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-200">Review</button>
                        </td>
                    </tr>
                `;
            });
        });
    }

    window.openReviewModal = async (uid) => {
        selectedPartnerId = uid;
        const snap = await helpers.getDoc(helpers.doc(db, "partners", uid));
        const p = snap.data();
        
        document.getElementById('view-title').textContent = "Review: " + p.businessName;
        document.getElementById('view-uid').textContent = uid;
        document.getElementById('view-name').textContent = p.businessName;
        document.getElementById('view-address').textContent = p.businessAddress;
        document.getElementById('btn-view-id').href = p.aadharUrl;
        document.getElementById('btn-view-biz').href = p.licenseUrl;
        
        document.getElementById('modal-view').classList.remove('hidden');
    };

    const updateStatus = async (status) => {
        if(!selectedPartnerId) return;
        const btn = status === 'approved' ? document.getElementById('btn-approve') : document.getElementById('btn-reject');
        const originalText = btn.innerText;
        btn.innerText = 'Processing...'; btn.disabled = true;
        
        try {
            await helpers.updateDoc(helpers.doc(db, "partners", selectedPartnerId), { verificationStatus: status });
            alert(`Partner ${status}!`);
            document.getElementById('modal-view').classList.add('hidden');
        } catch(e) { alert("Error: " + e.message); }
        finally { btn.innerText = originalText; btn.disabled = false; }
    };

    document.getElementById('btn-approve').addEventListener('click', () => updateStatus('approved'));
    document.getElementById('btn-reject').addEventListener('click', () => updateStatus('rejected'));
    document.getElementById('btn-admin-logout').addEventListener('click', () => helpers.signOut(auth).then(() => window.location.href = "loginpage.html"));
});