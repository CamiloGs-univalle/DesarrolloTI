// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVrmLKoIdLTqk0x8nA5QY6-nin0n5wJ3w",
  authDomain: "proservis-ti.firebaseapp.com",
  projectId: "proservis-ti",
  storageBucket: "proservis-ti.firebasestorage.app",
  messagingSenderId: "138550968182",
  appId: "1:138550968182:web:724991509be9b175494457",
  measurementId: "G-XXCF962JSJ"
};  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
