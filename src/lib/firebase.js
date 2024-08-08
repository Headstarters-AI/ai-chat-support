// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxu8fE8g8_FwBtaD5fTVj_87PnIt6uvW4",
    authDomain: "ai-customer-support-6bc48.firebaseapp.com",
    projectId: "ai-customer-support-6bc48",
    storageBucket: "ai-customer-support-6bc48.appspot.com",
    messagingSenderId: "388784865732",
    appId: "1:388784865732:web:23977295c202a148572491"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export { firestore };