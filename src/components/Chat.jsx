import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import messageStore from "../store/messageStore";
import roomStore from "../store/roomStore";
import useMessages from "../hooks/useMessages";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdOutlineGroup } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { PiBroom } from "react-icons/pi";
import { GrSend } from "react-icons/gr";
import toast from "react-hot-toast";

const Chat = ({}) => {
  const [newMessage, setNewMessage] = useState("");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { messages, fetchMessages, clearMessage, currentRoom, setCurrentRoom } =
    messageStore();
  const { rooms, fetchRooms, joinRoom, leaveRoom, deleteRoom } = roomStore();

  const { sendMessage } = useMessages(currentRoom);

  useEffect(() => {
    joinRoom(roomId);
    setCurrentRoom(roomId);
    const unsubscribe = fetchMessages(currentRoom);
    return () => unsubscribe();
  }, [currentRoom]);

  useEffect(() => {
    const unsubscribe = fetchRooms();
    return () => unsubscribe();
  }, [fetchRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendMessage(newMessage, auth.currentUser.displayName);
    setNewMessage("");
  };

  const onClearMessage = async () => {
    clearMessage(roomId);
    // const prompt = window.prompt("Enter password to clear history");
    // if (prompt === "ok") {
    //   clearMessage();
    // } else {
    //   alert("You don't have access to clear history.");
    // }
  };

  const onDeleteRoom = () => {
    // deleteRoom(currentRoom.id);
    rooms.forEach((room) => {
      if (room.name === roomId) {
        deleteRoom(room.id);
        toast.success("Room deleted successfully!");
        navigate("/");
      }
    });
    // navigate("/");
  };

  return (
    <div className="container p-10">
      <div className="bg-gray-800 py-5 rounded-md mb-3">
        <h1 className="text-3xl font-bold text-center">
          Welcome to: {currentRoom.toUpperCase()}
        </h1>
      </div>

      <div className="flex justify-between items-center mb-5">
        <Link
          onClick={() => leaveRoom(roomId)}
          to="/"
          className="bg-slate-300 px-4 py-1 text-gray-950 rounded-md"
        >
          <HiArrowLongLeft />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearMessage}
            className="border border-slate-200 px-4 py-1 rounded-md"
          >
            <PiBroom className="size-5" />
          </button>
          <button
            onClick={onDeleteRoom}
            className="flex items-center gap-2 bg-red-600 px-4 py-1 rounded-md"
          >
            Delete Room
          </button>
        </div>
      </div>

      <div className="mb-2">
        {messages.map((message) => (
          <div key={message.id}>
            <span className="font-bold">{message.user}</span> : {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="flex-grow w-full  md:w-auto bg-transparent border border-slate-200 px-2 py-2 rounded-md"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="flex items-center gap-2 border rounded-md border-slate-300 px-4 py-2"
          >
            Send
            <GrSend className="size-6 font-thin" />
          </button>
        </div>
      </form>
    </div>
  );
};
export default Chat;
