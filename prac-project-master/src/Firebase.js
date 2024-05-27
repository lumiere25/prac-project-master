// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD89GTIIAFCxMX47Yqv30hw_r6FMvPxb2o",
  authDomain: "prac-project-85fc8.firebaseapp.com",
  projectId: "prac-project-85fc8",
  storageBucket: "prac-project-85fc8.appspot.com",
  messagingSenderId: "251404553207",
  appId: "1:251404553207:web:db395e41bcb734dc71bcf2",
  databaseURL: "https://prac-project-85fc8-default-rtdb.asia-southeast1.firebasedatabase.app"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const Database = getDatabase(app);
