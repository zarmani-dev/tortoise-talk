import {
  collection,
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

  sendMessage: () => {},

  setCurrentRoom: (room) => set({ currentRoom: room }),
}));

export default messageStore;
