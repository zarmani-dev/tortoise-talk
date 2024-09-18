import { create } from "zustand";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-config";

const roomStore = create((set) => ({
  rooms: [], // Store all rooms and their details
  activeUsers: {}, // { roomId: numberOfUsers }

  // Fetch all rooms
  fetchRooms: () => {
    const q = query(collection(db, "rooms")); // assuming 'rooms' collection exists
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach((doc) => rooms.push({ ...doc.data(), id: doc.id }));
      set({ rooms });
    });
    return unsubscribe;
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
}));

export default roomStore;
