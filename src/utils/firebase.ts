import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCH0cKRNrKHtRVIqk6vyMJEwI8gcsSW_vk",
    authDomain: "colorful-days-dev.firebaseapp.com",
    projectId: "colorful-days-dev",
    storageBucket: "colorful-days-dev.appspot.com",
    messagingSenderId: "105839792711",
    appId: "1:105839792711:web:43e06f4fb81161f93e9762"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
