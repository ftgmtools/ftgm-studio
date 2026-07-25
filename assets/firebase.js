// Shared Firebase initialization (v10 modular, CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential, signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, onSnapshot, query, where,
  orderBy, serverTimestamp, writeBatch, collectionGroup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAd6FoDq-nmArzEVXO1WvR-n06Dg_fke8Y",
  authDomain: "salman-drm.firebaseapp.com",
  projectId: "salman-drm",
  storageBucket: "salman-drm.firebasestorage.app",
  messagingSenderId: "1076439490868",
  appId: "1:1076439490868:web:8070328eb0033697e8c561"
};

export const SUPER_ADMIN_UID = "BCggZZxfjagRMveRQi6ogMrK7c53";
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signInAnonymously,
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDocs,
  onSnapshot, query, where, orderBy, serverTimestamp, writeBatch, collectionGroup
};

// Small helper: is creator active based on expiryDate
export function isCreatorActive(data) {
  if (!data) return false;
  if (data.status === "blocked") return false;
  if (!data.expiryDate || data.expiryDate === "unlimited") return true;
  const t = typeof data.expiryDate === "number" ? data.expiryDate : Date.parse(data.expiryDate);
  return !isNaN(t) && t > Date.now();
}

// Persistent device fingerprint for license one-device-only
export function getDeviceId() {
  let id = localStorage.getItem("ftgm_device_id");
  if (!id) {
    id = "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ftgm_device_id", id);
  }
  return id;
}