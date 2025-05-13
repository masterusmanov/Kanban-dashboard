import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEDxs2oPmsYiR0GXVspqJ0PnxBdFNNIxg",
  authDomain: "kanban-ffaee.firebaseapp.com",
  projectId: "kanban-ffaee",
  storageBucket: "kanban-ffaee.firebasestorage.app",
  messagingSenderId: "574617937146",
  appId: "1:574617937146:web:b8b03eac4d59bb14999543",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };