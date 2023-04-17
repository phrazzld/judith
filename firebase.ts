import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  endBefore as endBeforeDocument,
  getDocs,
  getFirestore,
  limitToLast,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { ChatMessage, MessageBase } from "judith/types";

const prodConfig = {
  apiKey: "AIzaSyCmv2F5uK1aoyhkFMawZIo_94c1ovd09Uk",
  authDomain: "judith-beck.firebaseapp.com",
  projectId: "judith-beck",
  storageBucket: "judith-beck.appspot.com",
  messagingSenderId: "1080410332569",
  appId: "1:1080410332569:web:b02f5f3101000da97b0708",
};

const stagingConfig = {
  apiKey: "AIzaSyDRFg4CuMHZy-qSkSCFhiAu3vGA-alLW_k",
  authDomain: "judith-staging.firebaseapp.com",
  projectId: "judith-staging",
  storageBucket: "judith-staging.appspot.com",
  messagingSenderId: "1015643850727",
  appId: "1:1015643850727:web:46b75b71a42aeedc039f42",
};

const firebaseConfig =
  process.env.NODE_ENV === "production" ? prodConfig : stagingConfig;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createMessage = async (message: MessageBase) => {
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

export const getMessages = async (
  pageSize: number = 5,
  endBefore?: Timestamp
): Promise<ChatMessage[]> => {
  if (!auth.currentUser) {
    console.error("No user logged in");
    return [];
  }

  const extendedPageSize = pageSize * 2;

  const userRef = doc(db, "users", auth.currentUser.uid);
  const messagesQuery = query(
    collection(userRef, "messages"),
    orderBy("createdAt", "asc"),
    limitToLast(extendedPageSize),
    ...(endBefore ? [endBeforeDocument(endBefore)] : [])
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  const messages = messagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as MessageBase),
  }));

  const memoriesQuery = query(
    collection(userRef, "memories"),
    where("memoryType", "==", "judithReflection"),
    orderBy("createdAt", "asc"),
    limitToLast(extendedPageSize),
    ...(endBefore ? [endBeforeDocument(endBefore)] : [])
  );
  const memoriesSnapshot = await getDocs(memoriesQuery);
  const memories = memoriesSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        text:
          doc.data().memory +
          "\n\nTriggered Memories:\n\n" +
          doc.data().triggeredMemories,
        sender: "bot",
        note: "reflection",
        createdAt: doc.data().createdAt,
      } as ChatMessage)
  );

  // Merge and sort the messages and memories arrays
  const mergedArray = mergeSort(
    [...messages, ...memories],
    (a: any, b: any) => a.createdAt.toMillis() - b.createdAt.toMillis()
  );

  const limitedMergedArray = mergedArray.slice(-pageSize);
  return limitedMergedArray;
};

export const mergeSort = <T>(
  arr: T[],
  compare: (a: T, b: T) => number
): T[] => {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left, compare), mergeSort(right, compare), compare);
};

const merge = <T>(
  left: T[],
  right: T[],
  compare: (a: T, b: T) => number
): T[] => {
  let result = [];
  let indexLeft = 0;
  let indexRight = 0;

  while (indexLeft < left.length && indexRight < right.length) {
    if (compare(left[indexLeft], right[indexRight]) < 0) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
};
