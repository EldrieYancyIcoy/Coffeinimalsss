// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO0IewOJKpBgyT6qCvbHmpJXW-IN8eSoo",
  authDomain: "coffeinimals-69893.firebaseapp.com",
  projectId: "coffeinimals-69893",
  storageBucket: "coffeinimals-69893.firebasestorage.app",
  messagingSenderId: "490036842409",
  appId: "1:490036842409:web:5260eaeff05eae11947eb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)