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
import { Link, useParams } from "react-router-dom";

const Chat = ({}) => {
  const [newMessage, setNewMessage] = useState("");
  const { roomId } = useParams();

  const { messages, fetchMessages, currentRoom, setCurrentRoom } =
    messageStore();
  const { rooms } = roomStore();

  const { sendMessage } = useMessages(currentRoom);

  useEffect(() => {
    setCurrentRoom(roomId);
    const unsubscribe = fetchMessages(currentRoom);
    return () => unsubscribe();
  }, [currentRoom]);

  const messagesRef = collection(db, "messages");

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendMessage(newMessage, auth.currentUser.displayName);
    setNewMessage("");
  };

  const onClearMessage = async () => {
    const prompt = window.prompt("Enter password to clear history");
    if (prompt === "ok") {
      try {
        const queryMessages = query(messagesRef, where("room", "==", roomId));
        const snapShot = await getDocs(queryMessages); // Fetch current messages
        snapShot.forEach(async (document) => {
          await deleteDoc(doc(db, "messages", document.id)); // Delete each document
        });
      } catch (error) {
        console.error("Error clearing messages:", error);
      }
    } else {
      alert("You don't have access to clear history.");
    }
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
          to="/"
          className="bg-slate-300 px-4 py-1 text-gray-950 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </Link>
        <button
          onClick={onClearMessage}
          className="border border-slate-200 px-4 py-1 rounded-md"
        >
          Clear History
        </button>
      </div>

      <div className="mb-2">
        {messages.map((message) => (
          <div key={message.id}>
            <span className="font-bold">{message.user}</span> : {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="w-[80%] bg-transparent border border-slate-200 px-4 py-2 rounded-md"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="flex items-center gap-2 border rounded-md border-slate-300 px-4 py-2"
          >
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
export default Chat;
