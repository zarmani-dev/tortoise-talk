import { create } from "zustand";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

const roomStore = create((set) => ({
  rooms: [], // Store all rooms and their details
  activeUsers: {}, // { roomId: numberOfUsers }

  // Fetch all rooms
  fetchRooms: () => {
    const q = query(collection(db, "rooms"), orderBy("createAt")); // assuming 'rooms' collection exists
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach((doc) => rooms.push({ ...doc.data(), id: doc.id }));
      set({ rooms });
    });
    return unsubscribe;
  },

  createRoom: async (roomName) => {
    const roomsCollection = collection(db, "rooms");
    const user = auth.currentUser;
    const newRoom = {
      name: roomName,
      createAt: serverTimestamp(),
      createdBy: user.uid,
    };
    await addDoc(roomsCollection, newRoom);
  },

  // Fetch users per room
  fetchActiveUsersInRoom: (roomId) => {
    const usersQuery = query(
      collection(db, "users"),
      where("roomId", "==", roomId)
    );
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const activeUsers = {};
      snapshot.forEach((doc) => {
        const { roomId } = doc.data();
        activeUsers[roomId] = (activeUsers[roomId] || 0) + 1; // Count users per room
      });
      set({ activeUsers });
    });
    return unsubscribe;
  },

  joinRoom: async (roomId) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { roomId });
    }
  },

  leaveRoom: async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { roomId: null });
    }
  },

  deleteRoom: async (roomId) => {
    await deleteDoc(doc(db, "rooms", roomId));
  },
}));

export default roomStore;
