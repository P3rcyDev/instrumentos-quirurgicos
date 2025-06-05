// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJtwSLBadcgJtMxA9l_BZZISxYQzppxyc",
  authDomain: "karla-arsenalera.firebaseapp.com",
  projectId: "karla-arsenalera",
  storageBucket: "karla-arsenalera.firebasestorage.app",
  messagingSenderId: "1050366114974",
  appId: "1:1050366114974:web:59ba591ae5dba553970f8f",
  measurementId: "G-F8NHB4Z0XV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
