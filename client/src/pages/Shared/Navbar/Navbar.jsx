import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHome,
  FaUtensils,
  FaStore,
  FaEnvelope,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaCreditCard,
  FaStar,
  FaCalendarCheck,
  FaBookOpen,
  FaSignOutAlt,
  FaChevronRight,
  FaUserShield,
} from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";

/* ═══════════════════════════════════════════════════════════════════
   ROOT CAUSE FIXED — NAVBAR TURNS WHITE ON /order, /menu, /contact
   ──────────────────────────────────────────────────────────────────
   Old solidNav logic:
     const solidNav = scrolled || pathname.startsWith("/dashboard") || isAuthPage

   On /order/salad:
     - scrolled = false (top of page on load)
     - not /dashboard
     - not /login or /signup
   → solidNav = FALSE → bg-transparent navbar
   → All navbar text is white (text-white/70)
   → Page background is white (bg-base-100)
   → White text on white background = invisible navbar

   THE FIX:
   The glass/transparent navbar should ONLY appear on the HOME PAGE ("/")
   where the hero banner provides a dark background behind it.
   Every other page has a white background — it needs the solid dark navbar.

   New logic:
     const solidNav = pathname !== "/" || scrolled
   
   Translation: "Be solid everywhere EXCEPT the home page at scroll=0"
   On home page: transparent until user scrolls → classic hero effect
   On ALL other pages: always solid dark from the start
═══════════════════════════════════════════════════════════════════ */

const publicLinks = [
  { to: "/", label: "Home", Icon: FaHome },
  { to: "/menu", label: "Menu", Icon: FaUtensils },
  { to: "/order/salad", label: "Shop", Icon: FaStore },
  { to: "/contact", label: "Contact", Icon: FaEnvelope },
];

const customerLinks = [
  { to: "/dashboard/userHome", label: "Dashboard", Icon: FaTachometerAlt },
  { to: "/dashboard/cart", label: "My Cart", Icon: FaShoppingCart },
  { to: "/dashboard/payment_history", label: "Orders", Icon: FaClipboardList },
  { to: "/dashboard/payment", label: "Payment", Icon: FaCreditCard },
  { to: "/dashboard/review", label: "Reviews", Icon: FaStar },
  { to: "/dashboard/reservation", label: "Reservation", Icon: FaCalendarCheck },
  { to: "/dashboard/bookings", label: "Bookings", Icon: FaBookOpen },
];

const adminLinks = [
  { to: "/dashboard/adminHome", label: "Admin Home", Icon: FaUserShield },
  { to: "/dashboard/allUsers", label: "All Users", Icon: FaUsers },
  { to: "/dashboard/addItems", label: "Add Items", Icon: FaUtensils },
  {
    to: "/dashboard/manageItems",
    label: "Manage Items",
    Icon: FaClipboardList,
  },
  { to: "/dashboard/manageBooking", label: "Bookings", Icon: FaBookOpen },
];

/* ── desktop link ── */
const DLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "relative inline-flex items-center gap-1.5 px-1 py-1 text-[11px]",
        "uppercase tracking-[0.22em] font-bold transition-colors duration-200 outline-none group",
        isActive ? "text-secondary" : "text-white/70 hover:text-white",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        {children}
        <span
          className={[
            "absolute left-0 -bottom-0.5 h-px bg-secondary transition-all duration-300",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          ].join(" ")}
        />
      </>
    )}
  </NavLink>
);

/* ── drawer link ── */
const MLink = ({ to, label, Icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all",
        isActive
          ? "bg-secondary/12 text-secondary"
          : "text-white/50 hover:text-white hover:bg-white/5",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        <Icon
          className={`text-sm shrink-0 transition-colors ${isActive ? "text-secondary" : "text-white/25"}`}
        />
        <span className="tracking-wide flex-1">{label}</span>
        {isActive && (
          <FaChevronRight className="text-[10px] text-secondary/50" />
        )}
      </>
    )}
  </NavLink>
);

const SLabel = ({ children }) => (
  <p className="px-4 pt-5 pb-1.5 text-[9px] uppercase tracking-[0.38em] text-white/18 font-black">
    {children}
  </p>
);

const Navbar = () => {
  const { user, logOut } = useAuthValue();
  const { cart } = useCart();
  const { isAdmin } = useAdmin();
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cart?.length || 0;
  const dashLinks = isAdmin ? adminLinks : customerLinks;

  // [FIX] Scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    fn(); // run on mount so SSR/hydration gets correct value immediately
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Outside-click handler for dropdown
  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // [FIX] Dispatch to Main.jsx which locks BOTH html + body
  // Locking only body leaves scrollbar-gutter = ghost scrollbar
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("drawer-state", { detail: { locked: drawerOpen } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("drawer-state", { detail: { locked: false } }),
      );
    };
  }, [drawerOpen]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = async () => {
    closeDrawer();
    setDropdownOpen(false);
    const r = await Swal.fire({
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
    if (r.isConfirmed) {
      try {
        await logOut();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // [CORE FIX] Transparent ONLY on home page at scroll=0
  // Every other page always gets the solid dark navbar
  const solidNav = pathname !== "/" || scrolled;

  return (
    <>
      <nav
        className={[
          "w-full fixed top-0 left-0 right-0 transition-all duration-500 ease-in-out",
          solidNav
            ? "bg-primary/97 backdrop-blur-xl py-3 shadow-[0_4px_30px_rgba(0,0,0,0.35)] border-b border-white/5"
            : "bg-transparent py-5",
        ].join(" ")}
        style={{ zIndex: 50000 }}
      >
        <div className="app-container flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="group flex flex-col leading-none select-none">
            <span className="text-[1.6rem] font-black tracking-tight text-secondary transition-all duration-300 group-hover:tracking-wider">
              CAFE AZIZ
            </span>
            <span className="text-[8px] tracking-[0.5em] uppercase text-white/28 mt-0.5">
              Hotel &amp; Restaurant
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
            {publicLinks.map(({ to, label }) => (
              <li key={to}>
                <DLink to={to}>{label}</DLink>
              </li>
            ))}
            {user && (
              <li>
                <DLink
                  to={isAdmin ? "/dashboard/adminHome" : "/dashboard/cart"}
                >
                  {isAdmin ? (
                    "Dashboard"
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaShoppingCart className="text-sm" />
                      {cartCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-black ring-2 ring-primary leading-none">
                          {cartCount}
                        </span>
                      )}
                    </span>
                  )}
                </DLink>
              </li>
            )}
          </ul>

          {/* Desktop right — avatar / sign in */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 group focus:outline-none"
                >
                  <div className="relative">
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary z-10" />
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"
                      }
                      alt="avatar"
                      onError={(e) => {
                        e.target.src = "https://i.ibb.co/mJR9Qxc/user.png";
                      }}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/50 ring-offset-2 ring-offset-primary group-hover:ring-secondary transition-all"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors max-w-20 truncate tracking-wide">
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                  <motion.svg
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="w-3 h-3 text-white/30"
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
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.16)] border border-slate-100 overflow-hidden"
                      style={{ zIndex: 60000 }}
                    >
                      <div className="px-4 py-3.5 bg-linear-to-br from-slate-50 to-white border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest mt-0.5">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-black tracking-widest uppercase">
                            <FaUserShield className="text-[8px]" /> Admin
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to={
                            isAdmin
                              ? "/dashboard/adminHome"
                              : "/dashboard/userHome"
                          }
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-secondary/5 hover:text-secondary transition-colors"
                        >
                          <FaTachometerAlt className="w-4 h-4 text-slate-300" />{" "}
                          My Dashboard
                        </Link>
                        {!isAdmin && (
                          <Link
                            to="/dashboard/cart"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-secondary/5 hover:text-secondary transition-colors"
                          >
                            <FaShoppingCart className="w-4 h-4 text-slate-300" />{" "}
                            My Cart
                            {cartCount > 0 && (
                              <span className="ml-auto px-2 py-0.5 rounded-full bg-secondary text-white text-[10px] font-black">
                                {cartCount}
                              </span>
                            )}
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold border-t border-slate-100"
                      >
                        <FaSignOutAlt className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative overflow-hidden px-7 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase text-white border border-secondary/50 hover:border-secondary hover:shadow-[0_0_20px_rgba(5,150,105,0.25)] active:scale-95 transition-all group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-secondary hover:bg-white/5 transition-all active:scale-90"
            aria-label="Open menu"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              style={{ zIndex: 60001 }}
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-dvh w-72 bg-primary flex flex-col shadow-[-30px_0_80px_rgba(0,0,0,0.55)]"
              style={{ zIndex: 60002 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-white/[0.07] shrink-0">
                <div>
                  <p className="text-secondary font-black tracking-tighter text-lg leading-none">
                    CAFE AZIZ
                  </p>
                  <p className="text-[8px] text-white/22 tracking-[0.42em] uppercase mt-1">
                    Hotel &amp; Restaurant
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/45 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Nav links */}
              <div
                className="flex-1 overflow-y-auto py-2"
                style={{ scrollbarWidth: "none" }}
              >
                <SLabel>Navigation</SLabel>
                <div className="px-3 flex flex-col gap-0.5">
                  {publicLinks.map(({ to, label, Icon }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 + i * 0.05, duration: 0.22 }}
                    >
                      <MLink
                        to={to}
                        label={label}
                        Icon={Icon}
                        onClick={closeDrawer}
                      />
                    </motion.div>
                  ))}
                </div>

                {user && (
                  <>
                    <SLabel>{isAdmin ? "Admin Panel" : "My Account"}</SLabel>
                    <div className="px-3 flex flex-col gap-0.5">
                      {dashLinks.map(({ to, label, Icon }, i) => (
                        <motion.div
                          key={to}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.18 + i * 0.05,
                            duration: 0.22,
                          }}
                        >
                          <MLink
                            to={to}
                            label={label}
                            Icon={Icon}
                            onClick={closeDrawer}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 pb-8 pt-4 border-t border-white/[0.07] shrink-0 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/4 rounded-xl border border-white/6">
                      <div className="relative shrink-0">
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary z-10" />
                        <img
                          src={
                            user?.photoURL ||
                            "https://i.ibb.co/mJR9Qxc/user.png"
                          }
                          alt="avatar"
                          onError={(e) => {
                            e.target.src = "https://i.ibb.co/mJR9Qxc/user.png";
                          }}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/40"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate leading-tight">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-[10px] text-white/32 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500/18 transition-all active:scale-95"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="block w-full py-3.5 rounded-xl bg-secondary text-white font-black text-[11px] tracking-widest uppercase text-center hover:bg-secondary/90 transition-all active:scale-95 shadow-[0_4px_14px_rgba(5,150,105,0.3)]"
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
