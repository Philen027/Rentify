import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore, collection, query, where,
  onSnapshot, doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZHr-xXgx3tLnsUfF2RPxppZjE6cvirNY",
  authDomain: "rentify-93c05.firebaseapp.com",
  projectId: "rentify-93c05",
  storageBucket: "rentify-93c05.firebasestorage.app",
  messagingSenderId: "652243130812",
  appId: "1:652243130812:web:628fd64b4a69628eae73b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAIL = "philenkuriakose027@gmail.com";
let selectedPartnerId = null;

// 🔐 Admin auth check
onAuthStateChanged(auth, user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    location.href = "admin-login.html";
    return;
  }
  loadRequests();
});

// 📥 Load partner requests
function loadRequests() {
  const q = query(
    collection(db, "partners"),
    where("verificationStatus", "==", "submitted")
  );

  onSnapshot(q, snapshot => {
    const list = document.getElementById("requests-list");
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = `<tr><td colspan="4">No pending requests</td></tr>`;
      return;
    }

    snapshot.forEach(d => {
      const p = d.data();
      list.innerHTML += `
        <tr>
          <td>${p.businessName}</td>
          <td>${p.email}</td>
          <td>${p.submittedAt?.toDate().toLocaleDateString() || "-"}</td>
          <td>
            <button onclick="review('${d.id}')">Review</button>
          </td>
        </tr>
      `;
    });
  });
}

// 👀 Review partner
window.review = async (id) => {
  selectedPartnerId = id;
  const snap = await getDoc(doc(db, "partners", id));
  if (!snap.exists()) return alert("Partner not found");

  const p = snap.data();
  document.getElementById("view-name").innerText = p.businessName;
  document.getElementById("modal-view").classList.remove("hidden");
};

// ✅ Approve / Reject
window.updateStatus = async (status) => {
  if (!selectedPartnerId) return;
  await updateDoc(doc(db, "partners", selectedPartnerId), {
    verificationStatus: status
  });
  alert("Partner " + status);
  document.getElementById("modal-view").classList.add("hidden");
};

// 🚪 Logout
document.getElementById("btn-logout")
  .addEventListener("click", () =>
    signOut(auth).then(() => location.href = "admin-login.html")
  );
