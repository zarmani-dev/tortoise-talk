import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase-config";

const messageStore = create((set) => ({
  messages: [],
  currentRoom: "public",

  fetchMessages: (room) => {
    const queryMessage = query(
      collection(db, "messages"),
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) =>
        newMessages.push({ ...doc.data(), id: doc.id })
      );
      set({ messages: newMessages });
    });

    return unsubscribe;
  },
  clearMessage: async (roomId) => {
    const messagesRef = collection(db, "messages");
    const queryMessages = query(messagesRef, where("room", "==", roomId));
    const snapShot = await getDocs(queryMessages); // Fetch current messages
    snapShot.forEach(async (document) => {
      await deleteDoc(doc(db, "messages", document.id)); // Delete each document
    });
  },

  sendMessage: () => {},

  setCurrentRoom: (room) => set({ currentRoom: room }),
}));

export default messageStore;
