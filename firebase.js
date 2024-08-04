// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBggFJw5MBiRbk7YC_QLlMZ0QrB1fQu8Tg",
  authDomain: "inventory-management-4f064.firebaseapp.com",
  projectId: "inventory-management-4f064",
  storageBucket: "inventory-management-4f064.appspot.com",
  messagingSenderId: "148784518159",
  appId: "1:148784518159:web:2cf6cc2987fd8e1a51bf7a",
  measurementId: "G-X3NE925T55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore}