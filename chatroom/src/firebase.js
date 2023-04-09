// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbN2wOUcgRJTgDLSQ34tA489YbSOQpXTo",
  authDomain: "chatroomapp22017498.firebaseapp.com",
  projectId: "chatroomapp22017498",
  storageBucket: "chatroomapp22017498.appspot.com",
  messagingSenderId: "575493739380",
  appId: "1:575493739380:web:209422bbadb68936369221",
  measurementId: "G-M5HSZ2VNQD"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const analytics = getAnalytics(app);

export { app, firestore, auth, analytics };