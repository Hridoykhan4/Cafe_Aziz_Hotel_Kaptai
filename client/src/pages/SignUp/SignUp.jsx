import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiX,
  HiOutlineCloudUpload,
} from "react-icons/hi";
import axios from "axios";
import Swal from "sweetalert2";

import signupImg from "../../assets/others/authentication.gif";
import useAuthValue from "../../hooks/useAuthValue";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";

const cloudinaryKey = import.meta.env.VITE_Cloudinary_Image_Hosting_key;

const SignUp = () => {
  const axiosPublic = useAxiosPublic();
  const nav = useNavigate();
  const { createUser, updateUserProfile, user, setUser } = useAuthValue();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Auth Redirect
  useEffect(() => {
    if (user?.email) nav("/");
  }, [user, nav]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ── Image Handling ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      return Swal.fire({
        title: "Avatar Required",
        text: "Please upload a profile picture.",
        icon: "info",
      });
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", import.meta.env.VITE_CloudImageUser);

    try {
      // 1. Cloudinary Upload
      const { data: cloud } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryKey}/image/upload`,
        formData,
      );

      // 2. Firebase Creation
      const { user: firebaseUser } = await createUser(
        data.email,
        data.password,
      );
      await updateUserProfile(data.name, cloud?.url);

      // 3. Database Sync
      const userInfo = {
        name: data.name,
        email: data.email,
        role: "user",
        image: cloud?.url,
      };
      const res = await axiosPublic.post("/users", userInfo);

      if (res.data.insertedId || res.data.message) {
        Swal.fire({
          title: "Account Created!",
          text: `Welcome to the family, ${data.name}!`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setUser({
          ...firebaseUser,
          displayName: data.name,
          photoURL: cloud.url,
        });
        reset();
        nav("/");
      }
    } catch (err) {
      Swal.fire({ title: "Signup Error", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 lg:p-8 relative font-main">
      {/* ── ESCAPE ROUTE ── */}
      <Link
        to="/"
        className="absolute top-6 right-6 lg:top-10 lg:right-10 btn btn-circle btn-ghost bg-white/50 backdrop-blur-md shadow-sm border border-white hover:rotate-90 transition-all duration-300 z-50"
      >
        <HiX className="text-2xl text-primary" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl grid lg:grid-cols-2  bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white"
      >
        {/* ── LEFT SIDE: BRANDING ── */}
        <div className="hidden lg:flex relative bg-primary items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mt-40 blur-3xl" />

          <div className="relative z-10 text-center text-white">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={signupImg}
              alt="Join Cafe Aziz"
              className="w-full max-w-sm drop-shadow-2xl mb-8 rounded-3xl"
            />
            <h2 className="text-4xl font-black mb-4">
              Start Your <span className="text-secondary italic">Flavor</span>{" "}
              Journey.
            </h2>
            <p className="text-white/60 text-sm tracking-widest uppercase font-bold">
              Experience the future of dining
            </p>
          </div>
        </div>

        {/* ── RIGHT SIDE: FORM ── */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-secondary font-black tracking-[0.3em] text-[10px] uppercase">
              Join the community
            </span>
            <h1 className="text-4xl font-black text-primary mt-2">
              Create Account<span className="text-secondary">.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar Upload UI */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-base-200/40 rounded-2xl border border-dashed border-base-300">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-base-300 border-2 border-white shadow-md">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-base-content/30">
                      <HiOutlineCloudUpload size={24} />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatar"
                  accept="image/*"
                />
                <label
                  htmlFor="avatar"
                  className="absolute inset-0 cursor-pointer rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold"
                >
                  EDIT
                </label>
              </div>
              <div>
                <p className="text-xs font-black text-primary/70 tracking-widest uppercase">
                  Profile Image
                </p>
                <p className="text-[11px] text-base-content/50">
                  Upload a professional avatar
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label-text font-black text-[10px] mb-2 tracking-widest text-primary/50 uppercase">
                  Full Name
                </label>
                <input
                  {...register("name", { required: "Required", minLength: 3 })}
                  className="input bg-base-200/40 border-none focus:ring-2 focus:ring-secondary/20 rounded-xl h-12 px-5 font-medium"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 mt-1 font-bold">
                    Minimum 3 chars
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label-text font-black text-[10px] mb-2 tracking-widest text-primary/50 uppercase">
                  Email Address
                </label>
                <input
                  {...register("email", { required: "Required" })}
                  className="input bg-base-200/40 border-none focus:ring-2 focus:ring-secondary/20 rounded-xl h-12 px-5 font-medium"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label-text font-black text-[10px] mb-2 tracking-widest text-primary/50 uppercase">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  })}
                  className="input bg-base-200/40 border-none focus:ring-2 focus:ring-secondary/20 rounded-xl h-12 px-5 w-full font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff size={18} />
                  ) : (
                    <HiOutlineEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-400 mt-1 font-bold italic">
                  Include 1 uppercase, 1 lowercase & 1 number
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-14 rounded-xl text-white font-black tracking-[0.2em] shadow-lg shadow-primary/20 border-none active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "CREATE MY ACCOUNT"
              )}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-base-200"></span>
            </div>
            <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-base-content/20">
              Fast Connect
            </span>
          </div>

          <GoogleLoginButton />

          <p className="mt-8 text-center text-sm font-medium text-base-content/50">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-secondary font-black hover:text-primary transition-colors"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
