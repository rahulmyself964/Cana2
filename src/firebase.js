
import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzDsOLJjm_bOPRa8xa7Wf6tvOBb0VEUcQ",
  authDomain: "apps-ec5b3.firebaseapp.com",
  databaseURL: "https://apps-ec5b3-default-rtdb.firebaseio.com",
  projectId: "apps-ec5b3",
  storageBucket: "apps-ec5b3.firebasestorage.app",
  messagingSenderId: "24493629371",
  appId: "1:24493629371:web:b7f08c14a31d1d7542ae9e",
  measurementId: "G-BVRFY7TP49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
});


export { db };
