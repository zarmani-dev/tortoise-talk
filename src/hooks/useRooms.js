// import { useState, useEffect } from "react";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase-config";

// const useRooms = () => {
//   const [rooms, setRooms] = useState([]);
//   const [activeUsersPerRoom, setActiveUsersPerRoom] = useState({});

//   useEffect(() => {
//     const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
//       const newRooms = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setRooms(newRooms);
//     });

//     const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
//       const usersInRoom = {};
//       snapshot.docs.forEach((doc) => {
//         const { roomId } = doc.data();
//         usersInRoom[roomId] = (usersInRoom[roomId] || 0) + 1;
//       });
//       setActiveUsersPerRoom(usersInRoom);
//     });

//     return () => {
//       unsubscribeRooms();
//       unsubscribeUsers();
//     };
//   }, []);

//   return { rooms, activeUsersPerRoom };
// };

// export default useRooms;
