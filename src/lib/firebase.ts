import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Demo Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEMO_REPLACE_WITH_YOUR_API_KEY",
  authDomain: "examertric-demo.firebaseapp.com",
  projectId: "examertric-demo",
  storageBucket: "examertric-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:DEMO_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
