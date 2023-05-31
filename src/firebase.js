import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGGKYaHqvIf58e4zHOKjFgV6K7_cC6ruk",
  authDomain: "pokergame-assessment.firebaseapp.com",
  projectId: "pokergame-assessment",
  storageBucket: "pokergame-assessment.appspot.com",
  messagingSenderId: "1085062438915",
  appId: "1:1085062438915:web:e455d3baf7a2a7f0e6ee36",
  measurementId: "G-2B12RQCW1Y"
};

const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);