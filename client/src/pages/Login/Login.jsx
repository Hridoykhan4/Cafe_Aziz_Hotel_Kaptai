import loginImg from "../../assets/others/authentication1.png";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import useAuthValue from "../../hooks/useAuthValue";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
// eslint-disable-next-line no-unused-vars
import { easeInOut, motion } from "framer-motion";
import useScrollTo from "../../hooks/useScrollTo";
const Login = () => {
  useScrollTo();
  const [verified, setVerified] = useState(false);
  const { signIn } = useAuthValue();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      Swal.fire({
        title: "Missing fields",
        text: "Please enter both email and password.",
        icon: "warning",
        background: "#fef9c3",
        color: "#854d0e",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      const result = await signIn(email, password);
      Swal.fire({
        title: "Welcome back 👋",
        text: `Hello, ${result.user?.displayName || "User"}!`,
        icon: "success",
        background: "#ecfdf5",
        color: "#065f46",
        confirmButtonColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        title: "Login failed",
        text: err.message || "Something went wrong.",
        icon: "error",
        background: "#fef2f2",
        color: "#7f1d1d",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleVerify = (token) => {
    if (token) setVerified(true);
  };

  return (
    <motion.section
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, ease: easeInOut, duration: 1 }}
    >

      <div className="hero min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          {/* Image Side */}
          <div className="hidden lg:flex justify-center items-center w-1/2">
            <img
              src={loginImg}
              alt="Login"
              className="rounded-xl shadow-xl max-h-[450px] object-cover"
            />
          </div>

          {/* Form Side */}
          <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Welcome Back 👋
            </h2>
            {/* Google Login */}
            <GoogleLoginButton from={from} />

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <p className="text-center text-gray-500 mb-6">
              Please login to continue to{" "}
              <span className="font-semibold text-gray-700">Cafe Aziz</span>
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input input-bordered w-full rounded-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="input input-bordered w-full rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              {/* Recaptcha */}
              <div className="flex justify-center mt-4">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_Recaptcha_Site_key}
                  onChange={handleVerify}
                />
              </div>

              {!verified && (
                <p className="text-red-500 text-center text-sm">
                  Please verify the captcha to continue
                </p>
              )}

              <button
                disabled={!verified}
                className="btn btn-neutral w-full mt-4"
                type="submit"
              >
                Login
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link to="/signup" className="link text-blue-600 font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Login;
