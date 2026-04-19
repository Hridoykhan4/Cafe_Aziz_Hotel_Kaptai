import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeOff, HiX } from "react-icons/hi";
import Swal from "sweetalert2";

import loginImg from "../../assets/others/authentication1.png";
import useAuthValue from "../../hooks/useAuthValue";
import useScrollTo from "../../hooks/useScrollTo";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";

const Login = () => {
  useScrollTo();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuthValue();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location?.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!verified) return;
    
    setLoading(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      Swal.fire({
        title: "Welcome back!",
        text: `Successfully logged in as ${result.user?.displayName || "Member"}`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        background: "#ffffff",
        color: "#0f172a",
      });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        title: "Access Denied",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 lg:p-8 relative">
      
      {/* ── ESCAPE ROUTE (Top Right) ── */}
      <Link 
        to="/" 
        className="absolute top-6 right-6 lg:top-10 lg:right-10 btn btn-circle btn-ghost bg-white/50 backdrop-blur-md shadow-sm border border-white hover:rotate-90 transition-all duration-300"
      >
        <HiX className="text-2xl text-primary" />
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white"
      >
        
        {/* ── LEFT SIDE: UI/UX FORM ── */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
          
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-secondary font-black tracking-[0.3em] text-[10px] uppercase">Member Access</span>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-primary mt-2 mb-3">
                Sign In<span className="text-secondary">.</span>
              </h1>
              <p className="text-base-content/50 font-medium">
                Enter your credentials to access <span className="text-primary font-bold">Cafe Aziz</span>
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GoogleLoginButton from={from} />

            <div className="relative my-10 text-center">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-base-300"></span></div>
              <span className="relative bg-white px-6 text-[10px] font-black uppercase tracking-widest text-base-content/30">Secure Login</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-control">
                <label className="label-text font-black text-[11px] mb-2 tracking-widest text-primary/50">EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. chef@aziz.com"
                  className="input bg-base-200/40 w-full border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl transition-all h-14 px-6 font-medium"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label-text font-black text-[11px] mb-2 tracking-widest text-primary/50">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input bg-base-200/40 border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl transition-all h-14 px-6 w-full font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-secondary transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Verified ReCAPTCHA Container */}
              {/* <div className="flex flex-col items-center py-2">
                <div className="scale-90 md:scale-100 origin-center">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_Recaptcha_Site_key}
                    onChange={(t) => setVerified(!!t)}
                  />
                </div>
              </div> */}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-16 rounded-2xl text-white font-black tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] border-none"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "AUTHENTICATE ACCOUNT"
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-base-content/50">
                New to the platform?{" "}
                <Link to="/signup" className="text-secondary font-black hover:text-primary transition-colors underline-offset-8 decoration-2 decoration-secondary/30">
                  CREATE ACCOUNT
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT SIDE: IMMERSIVE BRANDING ── */}
        <div className="hidden lg:flex relative bg-primary items-center justify-center p-12 overflow-hidden">
          {/* Abstract SaaS Patterns */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <div className="relative z-10 max-w-sm text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <img
                src={loginImg}
                alt="Culinary App Preview"
                className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] mb-12 select-none"
              />
            </motion.div>
            
            <h2 className="text-3xl font-heading font-bold text-white mb-4 leading-tight">
              Unlock the <span className="italic text-secondary">Flavor</span> of Digital Management.
            </h2>
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => <span key={i} className="text-secondary text-lg">★</span>)}
            </div>
            <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">
              Premier Culinary SaaS Interface
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;