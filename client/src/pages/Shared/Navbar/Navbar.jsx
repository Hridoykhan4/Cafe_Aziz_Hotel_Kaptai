import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";

/* ─────────────────────────────────────────────
  Single NavLink item — shared by desktop & mobile
───────────────────────────────────────────── */
const NavItem = ({ to, onClick, children }) => (
<li className="list-none">
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "relative inline-flex items-center gap-1.5 px-1 py-1",
        "text-[11px] uppercase tracking-[0.22em] font-bold",
        "transition-colors duration-200 outline-none group",
        isActive ? "text-secondary" : "text-white/80 hover:text-white",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        {children}
        {/* animated underline */}
        <span
          className={[
            "absolute left-0 -bottom-0.5 h-px bg-secondary",
            "transition-all duration-300 ease-out",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          ].join(" ")}
        />
      </>
    )}
  </NavLink>
</li>
);

/* ─────────────────────────────────────────────
  Main Navbar component
───────────────────────────────────────────── */
const Navbar = () => {
const { user, logOut } = useAuthValue();
const { cart } = useCart();
const { isAdmin } = useAdmin();

const [drawerOpen, setDrawerOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

/* ── scroll detection ── */
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

/* ── close dropdown on outside click ── */
useEffect(() => {
  const handler = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

/* ── lock body scroll when drawer is open ── */
useEffect(() => {
  document.body.style.overflow = drawerOpen ? "hidden" : "";
  return () => {
    document.body.style.overflow = "";
  };
}, [drawerOpen]);

const closeDrawer = () => setDrawerOpen(false);

const handleLogout = async () => {
  closeDrawer();
  setDropdownOpen(false);
  const result = await Swal.fire({
    title: "Sign out?",
    text: "See you soon at Cafe Aziz!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#1e293b",
    confirmButtonText: "Sign Out",
    background: "#ffffff",
    color: "#0f172a",
  });
  if (result.isConfirmed) {
    try {
      await logOut();
    } catch (err) {
      console.error(err);
    }
  }
};

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/order/salad", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

/* ── Cart badge count ── */
const cartCount = cart?.length || 0;

return (
  <>
    {/* ══════════════════════════════════════════
        NAVBAR BAR
    ══════════════════════════════════════════ */}
    <nav
      className={[
        "fixed top-0 left-0 w-full z-[5000] transition-all duration-500 ease-in-out", // Added fixed positioning
        scrolled
          ? "bg-primary/95 backdrop-blur-xl py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] border-b border-white/[0.06]"
          : "bg-transparent py-5",
      ].join(" ")}
    >
      <div className="app-container flex items-center justify-between">
        {/* ── Brand ── */}
        <Link to="/" className="group flex flex-col leading-none select-none">
          <span className="text-2xl md:text-[1.65rem] font-black tracking-tight text-secondary transition-all duration-300 group-hover:tracking-wider">
            CAFE AZIZ
          </span>
          <span className="text-[8px] tracking-[0.55em] uppercase text-white/35 mt-0.5">
            Hotel &amp; Restaurant
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map(({ to, label }) => (
            <NavItem key={to} to={to}>
              {label}
            </NavItem>
          ))}

          {user && (
            <NavItem
              to={isAdmin ? "/dashboard/adminHome" : "/dashboard/cart"}
            >
              {isAdmin ? (
                <span>Admin</span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaShoppingCart className="text-sm" />
                  {cartCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-black leading-none ring-2 ring-primary">
                      {cartCount}
                    </span>
                  )}
                </span>
              )}
            </NavItem>
          )}
        </ul>

        {/* ── Desktop: avatar or sign-in ── */}
        <div className="hidden lg:flex items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 group focus:outline-none"
                aria-label="User menu"
              >
                <div className="relative">
                  {/* online ring */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-primary z-10" />
                  <img
                    src={
                      user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/60 ring-offset-2 ring-offset-primary transition-all duration-200 group-hover:ring-secondary"
                  />
                </div>
                <span className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors tracking-wide max-w-[90px] truncate">
                  {user.displayName?.split(" ")[0]}
                </span>
                <svg
                  className={`w-3 h-3 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-50"
                  >
                    {/* user info header */}
                    <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to={
                        isAdmin ? "/dashboard/adminHome" : "/dashboard/userHome"
                      }
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-secondary/5 hover:text-secondary transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold border-t border-slate-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="relative overflow-hidden px-7 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase text-white border border-secondary/50 transition-all duration-300 hover:border-secondary hover:shadow-[0_0_20px_rgba(5,150,105,0.3)] active:scale-95 group"
            >
              {/* shimmer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              Sign In
            </Link>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/80 hover:text-secondary hover:bg-white/5 transition-all duration-200 active:scale-90"
          aria-label="Open menu"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
    </nav>

    {/* ══════════════════════════════════════════
        MOBILE DRAWER
    ══════════════════════════════════════════ */}
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[6000]"
          />

          {/* drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed top-0 right-0 h-dvh w-[280px] bg-primary flex flex-col z-[6001] shadow-[-30px_0_80px_rgba(0,0,0,0.6)]"
          >
            {/* drawer header */}
            <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-white/[0.07]">
              <span className="text-secondary font-black tracking-tighter text-lg">
                CAFE AZIZ
              </span>
              <button
                onClick={closeDrawer}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* nav links */}
            <nav className="flex-1 px-7 pt-8 flex flex-col gap-1">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.25 }}
                >
                  <NavLink
                    to={to}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      [
                        "flex items-center justify-between px-4 py-3.5 rounded-xl",
                        "text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-200",
                        isActive
                          ? "bg-secondary/10 text-secondary"
                          : "text-white/60 hover:text-white hover:bg-white/5",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* drawer footer */}
            <div className="px-7 pb-10">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-white/5 rounded-xl">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"
                      }
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/50"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-white/40 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm tracking-wide hover:bg-red-500/20 transition-all active:scale-95"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="block w-full py-3.5 rounded-xl bg-secondary text-white font-black text-[11px] tracking-widest uppercase text-center hover:bg-secondary/90 transition-all active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
);
};

export default Navbar;
