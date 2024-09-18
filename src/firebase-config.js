// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnefd57OsG4PGcEaAxPTVGGKJVkXyqj3g",
  authDomain: "tortoise-chat-98df4.firebaseapp.com",
  projectId: "tortoise-chat-98df4",
  storageBucket: "tortoise-chat-98df4.appspot.com",
  messagingSenderId: "607461999414",
  appId: "1:607461999414:web:7796d906dbddb8952b6997",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
