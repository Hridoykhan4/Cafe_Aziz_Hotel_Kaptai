import { useState } from "react"; // Added for loading state
import { FcGoogle } from "react-icons/fc";
import useAuthValue from "../../hooks/useAuthValue";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import LoadingSpinner from "../LoadingSpinner";

const GoogleLoginButton = ({ from = "/" }) => {
  const { googleSignIn, setUser } = useAuthValue();
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Double-click guard
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleGoogleLogin = async () => {
    // 1. Prevent multiple clicks
    if (isAuthenticating) return;

    try {
      setIsAuthenticating(true);

      // 2. Trigger Google Auth
      const result = await googleSignIn();
      const googleUser = result?.user;

      // 3. Update Auth Context
      setUser({
        ...googleUser,
        displayName: googleUser?.displayName,
        photoURL: googleUser?.photoURL,
      });

      const userInfo = {
        name: googleUser?.displayName,
        email: googleUser?.email,
        role: "user",
      };

      // 4. Sync with Database
      await axiosPublic.post("/users", userInfo);

      // 5. Success Feedback
      Swal.fire({
        title: "Welcome Back 🎉",
        text: `Successfully authenticated as ${googleUser?.displayName || "Member"}`,
        icon: "success",
        background: "#ffffff",
        color: "#0f172a",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate(from, { replace: true });
    } catch (err) {
      // Handle "Popup closed" or "Cancelled" errors gracefully
      console.error("Google Auth Error:", err);

      // Only show error alert if it's not a user-cancellation
      if (err.code !== "auth/popup-closed-by-user") {
        Swal.fire({
          title: "Sign-In Interrupted",
          text: err.message || "Could not connect to Google.",
          icon: "error",
          confirmButtonColor: "#0f172a",
        });
      }
    } finally {
      // 6. Unlock the button regardless of outcome
      setIsAuthenticating(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      disabled={isAuthenticating} // Disable interaction while loading
      className={`group w-full flex items-center justify-center gap-3 h-14 border-2 border-base-200 rounded-2xl bg-white transition-all duration-300 shadow-sm
        ${
          isAuthenticating
            ? "opacity-70 cursor-not-allowed bg-base-100"
            : "hover:bg-base-50 hover:border-primary/10 active:scale-[0.98] hover:shadow-md cursor-pointer"
        }`}
    >
      {isAuthenticating && (
        <div className="fixed inset-0 z-100 bg-white/20 backdrop-blur-[2px] cursor-wait flex items-center justify-center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {isAuthenticating ? (
        <>
          <span className="loading loading-spinner loading-sm text-primary"></span>
          <span className="text-sm font-black tracking-widest text-primary/40 uppercase">
            Connecting...
          </span>
        </>
      ) : (
        <>
          <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-black tracking-widest text-primary/70 uppercase">
            Continue with Google
          </span>
        </>
      )}
    </button>
  );
};

export default GoogleLoginButton;
