// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyn3abxolpNirYGINJPWtAcWejQZq2cgY",
  authDomain: "voterverification-fe7a3.firebaseapp.com",
  databaseURL: "https://voterverification-fe7a3-default-rtdb.firebaseio.com",
  projectId: "voterverification-fe7a3",
  storageBucket: "voterverification-fe7a3.firebasestorage.app",
  messagingSenderId: "799440129922",
  appId: "1:799440129922:web:8fce092ea8dc9e0189899b",
  measurementId: "G-5YZZE21YNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);