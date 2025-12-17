// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZHr-xXgx3tLnsUfF2RPxppZjE6cvirNY",
  authDomain: "rentify-93c05.firebaseapp.com",
  projectId: "rentify-93c05",
  storageBucket: "rentify-93c05.firebasestorage.app",
  messagingSenderId: "652243130812",
  appId: "1:652243130812:web:628fd64b4a69628eae73b9"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Global exposure (IMPORTANT)
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;

window.firebaseHelpers = {
  // AUTH
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,

  // FIRESTORE
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  onSnapshot,

  // STORAGE
  ref,
  uploadBytes,
  getDownloadURL
};

console.log("🔥 Firebase fully initialised");
console.log(
  "🔥 ACTIVE firebase-config.js LOADED",
  Object.keys(window.firebaseHelpers)
);
