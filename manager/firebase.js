// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1Y7SqmZBr7axI3Gh4kjaL3Mir7myfbHY",
  authDomain: "cng-management.firebaseapp.com",
  projectId: "cng-management",
  storageBucket: "cng-management.appspot.com",
  messagingSenderId: "981115164175",
  appId: "1:981115164175:web:614b8bdcada3a343bb357a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)