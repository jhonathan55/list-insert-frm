// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB5lTFjnTfLBpFZLpfeXmw6aJEvwKGIkAw",
  authDomain: "react-2eafd.firebaseapp.com",
  projectId: "react-2eafd",
  storageBucket: "react-2eafd.appspot.com",
  messagingSenderId: "277956376921",
  appId: "1:277956376921:web:6e881a72bf43e531caf448",
  measurementId: "G-6527Q4YFBW"
};
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
