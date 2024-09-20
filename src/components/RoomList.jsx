import React, { useEffect } from "react";
import roomStore from "../store/roomStore";
import { Link } from "react-router-dom";
import { IoEnterOutline } from "react-icons/io5";

const RoomList = () => {
  const { rooms, fetchRooms, activeUsers, fetchActiveUsersInRoom } =
    roomStore();

  // const { currentRoom } = messageStore();

  // const { activeUsers } = useActiveUsers(currentRoom);
  // console.log(activeUsers);

  useEffect(() => {
    const unsubscribe = fetchRooms();
    return () => unsubscribe();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        fetchActiveUsersInRoom(room.name); // Fetch active users for each room
      });
    }
  }, [rooms, fetchActiveUsersInRoom]);

  return (
    <div className="container px-10 pt-10">
      <h3 className="text-2xl bg-gray-700 p-3 rounded-lg mb-2">
        Available Rooms ( {rooms.length} )
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-slate-300 p-3 rounded-md mb-3"
          >
            <div className="flex  justify-between items-center">
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <div
                className={`size-3 rounded-full ${
                  activeUsers[room.name] == null ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
            </div>
            <p className="mt-2">`{activeUsers[room.name] || 0}` users online</p>
            <Link
              to={`/${room.name}`}
              className="mt-4 inline-flex items-center   gap-1 border border-slate-200 px-2 py-1 rounded-md"
            >
              Enter <IoEnterOutline className="size-5" />{" "}
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
