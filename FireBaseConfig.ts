// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApUtnQq9-vvCSHkP5VkzcfriTI5gEGfSE",
  authDomain: "delta-jsfirebase.firebaseapp.com",
  projectId: "delta-jsfirebase",
  storageBucket: "delta-jsfirebase.appspot.com",
  messagingSenderId: "258469398608",
  appId: "1:258469398608:web:f233d519f485569eae6955",
  measurementId: "G-LY379PBGPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
