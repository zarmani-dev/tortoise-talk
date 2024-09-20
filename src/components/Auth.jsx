import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebase-config";
import TortoiseLogo from "../assets/tortoise.png";

import Cookies from "universal-cookie";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
const cookies = new Cookies();

const Auth = ({ setIsAuth, setUser }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);

      // Update users
      const user = result.user;
      setUser(user);
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          displayName: user.displayName,
          email: user.email,
          online: true,
          roomId: null,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );

      // Set the user to offline when they close the browser
      window.addEventListener("offline", async () => {
        await updateDoc(userRef, {
          online: false,
          lastActive: serverTimestamp(),
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container h-2/3 w-full md:w-2/3 lg:w-1/3 py-10 ">
      <div className="border flex flex-col gap-4 items-center justify-center h-full border-l-slate-200 p-5 rounded-md ">
        <div className="self-start flex items-center gap-2">
          <img src={TortoiseLogo} className="size-20" alt="" />
          <span className="text-3xl font-bold bg-gradient-to-r from-green-400 via-slate-200 to-amber-600  text-transparent bg-clip-text">
            Tortoise Talk
          </span>
        </div>
        <button
          onClick={signInWithGoogle}
          className=" w-full flex gap-2 items-center border border-slate-200 px-4 py-2 rounded-md"
        >
          <img
            src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
            className="size-7"
            alt="Google Icon"
          />
          Continue with Google
        </button>
        {/* Separator */}
        <div>or</div>

        <input
          type="text"
          placeholder="Email address"
          className="bg-transparent border border-slate-200/60 px-4 py-1 rounded-md w-full outline-none focus:border-slate-200"
        />

        <button
          onClick={() =>
            alert(
              "This feature is under maintenance!\nPlease Sign In With Google instead."
            )
          }
          className="border bg-slate-300/90 w-full rounded-xl px-4 py-1 text-gray-950 text-xl mt-3"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
export default Auth;
