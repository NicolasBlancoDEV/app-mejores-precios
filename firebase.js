import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAH79Cxqb64KarifDMfd_Fz8Ve3hba2WPo",
  authDomain: "pricecompareapp-8831e.firebaseapp.com",
  projectId: "pricecompareapp-8831e",
  storageBucket: "pricecompareapp-8831e.firebasestorage.app",
  messagingSenderId: "154771645191",
  appId: "1:154771645191:web:14e043add23e0d7d31dba2",
  measurementId: "G-9F0HP6H07D"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };