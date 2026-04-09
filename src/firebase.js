/*
 * Firebase integration for user tracking.
 *
 * SETUP (one-time):
 *   1. Go to https://console.firebase.google.com
 *   2. Create a project (e.g., "cca-study-plan")
 *   3. Add a Web App → copy the config object below
 *   4. Enable Firestore Database (start in test mode)
 *   5. Replace the placeholder values below with your config
 *   6. Deploy
 *
 * Until configured, the app falls back to localStorage only.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAFf9eGCsFBL3AIdtpUb_CqzzJS_RhEXn0",
  authDomain: "cca-study-plan.firebaseapp.com",
  projectId: "cca-study-plan",
  storageBucket: "cca-study-plan.firebasestorage.app",
  messagingSenderId: "378298798232",
  appId: "1:378298798232:web:b37cd47a165fb59974c0ed",
  measurementId: "G-5TKPJKCN75",
};

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";
}

let db = null;
let _initPromise = null;

async function getDb() {
  if (db) return db;
  if (!isFirebaseConfigured()) return null;
  if (!_initPromise) {
    _initPromise = (async () => {
      const { initializeApp } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      return db;
    })();
  }
  return _initPromise;
}

export async function loadUserProgress(email) {
  const firestore = await getDb();
  if (!firestore) return null;
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(firestore, "users", email));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn("Firestore load failed, using localStorage:", e.message);
    return null;
  }
}

export async function saveUserProgress(email, data) {
  const firestore = await getDb();
  if (!firestore) return;
  try {
    const { doc, setDoc } = await import("firebase/firestore");
    await setDoc(doc(firestore, "users", email), {
      email,
      lastSeen: new Date().toISOString(),
      ...data,
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore save failed:", e.message);
  }
}
