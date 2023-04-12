import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmv2F5uK1aoyhkFMawZIo_94c1ovd09Uk",
  authDomain: "judith-beck.firebaseapp.com",
  projectId: "judith-beck",
  storageBucket: "judith-beck.appspot.com",
  messagingSenderId: "1080410332569",
  appId: "1:1080410332569:web:b02f5f3101000da97b0708"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
