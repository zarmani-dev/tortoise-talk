import { useEffect, useRef, useState } from "react";
import Auth from "./components/Auth";

import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import { auth, db } from "./firebase-config";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import RoomList from "./components/RoomList";
import { Link, Navigate, useNavigate } from "react-router-dom";
import roomStore from "./store/roomStore";
const cookies = new Cookies();

const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token")); // true
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // const [room, setRoom] = useState(null);
  const { rooms, createRoom } = roomStore();

  const inputRef = useRef();

  const onCreateRoom = async () => {
    const roomName = inputRef.current.value;
    if (roomName.trim() === "") return;

    await createRoom(roomName);
    navigate(`/${roomName}`);
    inputRef.current.value = "";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUserOut = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      online: false,
      lastActive: serverTimestamp(),
    });
    signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(null);
  };

  return (
    <div>
      {!isAuth && <Auth setIsAuth={setIsAuth} setUser={setUser} />}

      {/* Sign Out Button */}
      {isAuth && (
        <div className="p-4 text-right">
          <button
            onClick={signUserOut}
            className=" border border-slate-200 bg-slate-200/70 text-gray-950 rounded-md  px-4 py-2"
          >
            Sign Out
          </button>
        </div>
      )}

      {isAuth && (
        <div className="container">
          <div className="flex flex-col gap-2 w-2/3">
            <label>Enter Room Name</label>
            <input
              type="text"
              ref={inputRef}
              placeholder="Eg. Chill out"
              className="bg-transparent border border-slate-200 rounded-md px-4 py-2"
            />
            <Link
              onClick={onCreateRoom}
              className="text-left text-slate-300 border border-slate-200 px-4 py-2 rounded-md w-28"
            >
              Enter Chat
            </Link>
          </div>
        </div>
      )}

      {isAuth && <RoomList />}
    </div>
  );
};
export default App;
