import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { NewMessage, TMessage } from "judith/types";

const firebaseConfig = {
  apiKey: "AIzaSyCmv2F5uK1aoyhkFMawZIo_94c1ovd09Uk",
  authDomain: "judith-beck.firebaseapp.com",
  projectId: "judith-beck",
  storageBucket: "judith-beck.appspot.com",
  messagingSenderId: "1080410332569",
  appId: "1:1080410332569:web:b02f5f3101000da97b0708",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createMessage = async (message: NewMessage) => {
  if (!auth.currentUser) {
    console.error("No user logged in");
    return;
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const messageRef = await addDoc(collection(userRef, "messages"), {
    ...message,
    createdAt: new Date(),
  });
  return messageRef;
};

export const getMessages = async (): Promise<TMessage[]> => {
  if (!auth.currentUser) {
    console.error("No user logged in");
    return [];
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const messagesQuery = query(
    collection(userRef, "messages"),
    orderBy("createdAt", "asc")
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  return messagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as NewMessage),
  }));
};
