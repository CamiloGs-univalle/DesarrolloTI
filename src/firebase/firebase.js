
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr5NeTVgrpA6acrnSyO508xa_smPlD0vE",
  authDomain: "ti-desarrollo-pt.firebaseapp.com",
  projectId: "ti-desarrollo-pt",
  storageBucket: "ti-desarrollo-pt.firebasestorage.app",
  messagingSenderId: "349935778130",
  appId: "1:349935778130:web:866c8b7d012d28b889e28b",
  measurementId: "G-48FBMC22C7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
