// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSXgrR1jlo2uYcOfmVhmEAgbifNuQC2Io",
  authDomain: "pantry-app-headstarter.firebaseapp.com",
  projectId: "pantry-app-headstarter",
  storageBucket: "pantry-app-headstarter.appspot.com",
  messagingSenderId: "930578132444",
  appId: "1:930578132444:web:1f13274ba60db1dfe67319"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app,firestore }

// // Try to use reactFire next time (match layout.js)
// export {app,firebaseConfig }