// /public/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBcK58xxuFEHFBunE7FxJ9OHzpUs5aKCfs",
  authDomain: "rentify-93c05.firebaseapp.com",
  projectId: "rentify-93c05",
  storageBucket: "rentify-93c05.firebasestorage.app",
  messagingSenderId: "652243130812",
  appId: "1:652243130812:web:628fd64b4a69628eae73b9"
};

firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage();
db.settings({ ignoreUndefinedProperties: true });
