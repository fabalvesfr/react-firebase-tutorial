// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5sX1rsu0WPO2dCjghsVOABiqBPlR_U9s",
  authDomain: "fir-tutorial-270fc.firebaseapp.com",
  projectId: "fir-tutorial-270fc",
  storageBucket: "fir-tutorial-270fc.appspot.com",
  messagingSenderId: "932909545826",
  appId: "1:932909545826:web:7490d045c1ce739513943b",
  measurementId: "G-FHJ4LET9FL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
