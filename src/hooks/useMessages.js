import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";

const useMessages = (roomId) => {
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs
        .filter((doc) => doc.data().room === roomId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (newMessage, user) => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user,
      room: roomId,
    });
  };

  return { allMessages, sendMessage };
};

export default useMessages;
