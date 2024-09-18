import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebase-config";

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
    <div className="container p-10">
      <button
        onClick={signInWithGoogle}
        className="flex gap-2 items-center border border-slate-200 px-4 py-2 rounded-md"
      >
        <img
          src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
          className="size-7"
          alt="Google Icon"
        />
        Continue with Google
      </button>
    </div>
  );
};
export default Auth;
