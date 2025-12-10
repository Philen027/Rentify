import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, 
  query, where, orderBy, getDocs, serverTimestamp, Timestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZHr-xXgx3tLnsUfF2RPxppZjE6cvirNY",
  authDomain: "rentify-93c05.firebaseapp.com",
  projectId: "rentify-93c05",
  storageBucket: "rentify-93c05.firebasestorage.app",
  messagingSenderId: "652243130812",
  appId: "1:652243130812:web:628fd64b4a69628eae73b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Attach globally for access in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseHelpers = {
  googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, signOut, onAuthStateChanged,
  serverTimestamp, Timestamp, onSnapshot,
  collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, orderBy, getDocs,
  ref, uploadBytes, getDownloadURL
};

console.log("🔥 Firebase Initialized Successfully");