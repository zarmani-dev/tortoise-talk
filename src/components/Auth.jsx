import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase-config";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
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
