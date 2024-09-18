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
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

const Chat = ({ room }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapShot) => {
      let messages = [];
      snapShot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage) return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
  };

  const onClearMessage = async () => {
    let prompt = window.prompt("Enter password to clear history");
    if (prompt == "ok") {
      const queryMessages = query(messagesRef, where("room", "==", room));
      onSnapshot(queryMessages, async (snapShot) => {
        snapShot.forEach(async (document) => {
          await deleteDoc(doc(db, "messages", document.id));
        });
      });
    } else {
      alert("You don't have access to clear history.");
    }
  };

  return (
    <div className="border border-slate-200 rounded-md p-10">
      <div className="bg-gray-800 py-5 rounded-md mb-3">
        <h1 className=" text-3xl font-bold text-center">
          Welcome to: {room.toUpperCase()}
        </h1>
      </div>
      <div className="text-right">
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
      <form onSubmit={handleSubmit} className="">
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="flex-grow bg-transparent border border-slate-200 px-4 py-2 rounded-md"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="flex items-center gap-2 border border-slate-300 px-4 py-2"
          >
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
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
