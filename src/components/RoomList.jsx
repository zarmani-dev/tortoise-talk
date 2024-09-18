import React, { useEffect } from "react";
import roomStore from "../store/roomStore";

const RoomList = () => {
  const { rooms, fetchRooms, activeUsers, fetchActiveUsersInRoom } =
    roomStore();

  useEffect(() => {
    const unsubscribe = fetchRooms();
    rooms.forEach((room) => fetchActiveUsersInRoom(room.id));
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3>Available Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} - {activeUsers[room.id] || 0} users online
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
