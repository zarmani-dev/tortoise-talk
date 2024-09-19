import React, { useEffect } from "react";
import roomStore from "../store/roomStore";
import { Link } from "react-router-dom";

const RoomList = () => {
  const { rooms, fetchRooms, activeUsers, fetchActiveUsersInRoom } =
    roomStore();

  useEffect(() => {
    const unsubscribe = fetchRooms();
    rooms.forEach((room) => fetchActiveUsersInRoom(room.id));
    return () => unsubscribe();
  }, []);

  return (
    <div className="container px-10 pt-10">
      <h3 className="text-2xl bg-gray-700 p-3 rounded-lg mb-2">
        Available Rooms ( {rooms.length} )
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={`/${room.name}`}
            className="border border-slate-300 p-3 rounded-md mb-3"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <div
                className={`size-3 rounded-full ${
                  Object.keys(activeUsers).length === 0
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              ></div>
            </div>
            <p>`{activeUsers[room.id] || 0}` users online</p>
            {/* {room.name} - {activeUsers[room.id] || 0} users online */}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
