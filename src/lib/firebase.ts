import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAxe5Vx9Wq099fYxhoOhpFnQPPKxhOKQAI",
  authDomain: "dependable-client-mqvh5.firebaseapp.com",
  projectId: "dependable-client-mqvh5",
  storageBucket: "dependable-client-mqvh5.firebasestorage.app",
  messagingSenderId: "229655415519",
  appId: "1:229655415519:web:288d3cb3e36b8cb72a776a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
