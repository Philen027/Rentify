// public/firebase-config.js

// Import Firebase SDKs (v12 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// 🔐 Your Firebase config (same as console)
const firebaseConfig = {
  apiKey: "AIzaSyBcK58xxuFEHFBunE7FxJ9OHzpUs5aKCfs",
  authDomain: "rentify-93c05.firebaseapp.com",
  projectId: "rentify-93c05",
  storageBucket: "rentify-93c05.firebasestorage.app",
  messagingSenderId: "652243130812",
  appId: "1:652243130812:web:628fd64b4a69628eae73b9"
};

// ✅ Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Make them available to normal <script> tags
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseHelpers = {
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  serverTimestamp,
  collection,
  addDoc,
  doc,
  setDoc
};

// -------------------------------------------------
//  PARTNER: Save Partner + Store to Firestore
// -------------------------------------------------
window.savePartnerAndStore = async function (formData) {
  const email = formData.get("email") || "";
  const fullname = formData.get("fullname") || "";
  const phone = formData.get("phone") || "";
  const address1 = formData.get("address1") || "";
  const city = formData.get("city") || "";
  const state = formData.get("state") || "";
  const pin = formData.get("pin") || "";
  const bizName = formData.get("biz_name") || "Rentify Store";
  const planId = formData.get("plan") || "free";

  // 1️⃣ Create Partner document
  const partnerRef = await addDoc(collection(db, "partners"), {
    email,
    fullname,
    phone,
    address: { line1: address1, city, state, pin },
    createdAt: serverTimestamp(),
    role: "partner"
  });

  const partnerId = partnerRef.id;

  // 2️⃣ Create Store document linked to partner
  const storeRef = await addDoc(collection(db, "stores"), {
    partnerId,
    name: bizName || "Rentify Tech Hub",
    city: city || "Unknown",
    address: address1,
    status: "active",
    planId,
    createdAt: serverTimestamp()
  });

  const storeId = storeRef.id;

  return { partnerId, storeId };
};

// -------------------------------------------------
//  CUSTOMER: Save Customer Profile
//  (called after successful auth)
// -------------------------------------------------
window.saveCustomerProfile = async function (uid, profile) {
  const { email, phone, state, city, country, pin } = profile;

  await setDoc(doc(db, "customers", uid), {
    email: email || "",
    phone: phone || "",
    address: {
      state: state || "",
      city: city || "",
      country: country || "",
      pin: pin || ""
    },
    role: "customer",
    createdAt: serverTimestamp()
  }, { merge: true });
};

// -------------------------------------------------
//  PHONE OTP Helper: Setup Recaptcha
//  You use this from loginpage.html
// -------------------------------------------------
// -------------------------------------------------
//  PHONE OTP Helper: Setup Recaptcha  ✅ FIXED
// -------------------------------------------------
window.setupPhoneRecaptcha = function (containerId) {
  if (!window.firebasePhoneRecaptcha) {
    window.firebasePhoneRecaptcha = new RecaptchaVerifier(
      auth,              // 1) auth FIRST
      containerId,       // 2) then the container id
      { size: "invisible" } // 3) options
    );
  }
  return window.firebasePhoneRecaptcha;
};


