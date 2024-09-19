import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

const useActiveUsers = (roomId) => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("roomId", "==", roomId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setActiveUsers(users);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { activeUsers };
};

export default useActiveUsers;
