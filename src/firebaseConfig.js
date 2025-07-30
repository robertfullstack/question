import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // 🔹 novo


const firebaseConfig = {
    apiKey: "AIzaSyDax4YRBGoFXJx73US92kF0O2dO7-EUWew",
    authDomain: "projeto-a72af.firebaseapp.com",
    databaseURL: "https://projeto-a72af-default-rtdb.firebaseio.com",
    projectId: "projeto-a72af",
    storageBucket: "projeto-a72af.firebasestorage.app",
    messagingSenderId: "969286433255",
    appId: "1:969286433255:web:f714f5691ecbf77a362542"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); // 🔹 novo


export { db, auth };