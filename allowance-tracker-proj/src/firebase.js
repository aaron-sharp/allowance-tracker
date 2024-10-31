// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_s2FUhyVlBW8Pt07XgKHusaq47klYvGM",
  authDomain: "allowance-tracker-a54c5.firebaseapp.com",
  projectId: "allowance-tracker-a54c5",
  storageBucket: "allowance-tracker-a54c5.firebasestorage.app",
  messagingSenderId: "184680740605",
  appId: "1:184680740605:web:d52e9c116cb5e8ea16f094"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
