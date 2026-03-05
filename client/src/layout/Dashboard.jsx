import { useState, useEffect } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaCalendar,
  FaPaypal,
  FaStar,
  FaBook,
  FaUtensils,
  FaList,
  FaUsers,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaSignOutAlt,
  FaUserShield,
  FaStore,
  FaEnvelope,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";
import useMyBookings from "../hooks/useMyBookings";
import Swal from "sweetalert2";

/* ─────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────── */
const adminNav = [
  { to: "/dashboard/adminHome", label: "Admin Home", Icon: MdDashboard },
  { to: "/dashboard/addItems", label: "Add Items", Icon: FaUtensils },
  { to: "/dashboard/manageItems", label: "Manage Items", Icon: FaList },
  { to: "/dashboard/manageBooking", label: "Bookings", Icon: FaBook },
  { to: "/dashboard/allUsers", label: "All Users", Icon: FaUsers },
];

const userNav = [
  { to: "/dashboard/userHome", label: "My Home", Icon: FaHome },
  {
    to: "/dashboard/cart",
    label: "My Cart",
    Icon: FaShoppingCart,
    badge: "cart",
  },
  { to: "/dashboard/reservation", label: "Reservation", Icon: FaCalendar },
  { to: "/dashboard/payment_history", label: "Orders", Icon: FaPaypal },
  { to: "/dashboard/review", label: "Add Review", Icon: FaStar },
  {
    to: "/dashboard/bookings",
    label: "My Bookings",
    Icon: FaBook,
    badge: "bookings",
  },
];

const publicNav = [
  { to: "/", label: "Home", Icon: FaHome },
  { to: "/order/salad", label: "Shop", Icon: FaStore },
  { to: "/contact", label: "Contact", Icon: FaEnvelope },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="px-4 pt-6 pb-2 text-[9px] font-black tracking-[0.38em] uppercase text-white/20">
    {children}
  </p>
);

/* ════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════ */
const Dashboard = () => {
  const { cart } = useCart();
  const { isAdmin, isAdminLoading } = useAdmin();
  const { user, logOut } = useAuthValue();
  const { myBookings } = useMyBookings();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* close sidebar on route change */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /* lock body when sidebar open on mobile */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
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
      } catch (e) {
        console.error(e);
      }
    }
  };

  const badges = {
    cart: cart?.length || 0,
    bookings: myBookings?.length || 0,
  };

  const dashLinks = isAdmin ? adminNav : userNav;

  /* ── sidebar NavLink ── */
  const SideLink = ({ to, label, Icon, badge }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 outline-none",
          isActive
            ? "bg-secondary/15 text-secondary"
            : "text-white/50 hover:text-white hover:bg-white/5",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* active left bar */}
          {isActive && (
            <motion.span
              layoutId="sidebarActive"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Icon
            className={`text-base shrink-0 transition-colors ${isActive ? "text-secondary" : "text-white/25 group-hover:text-white/50"}`}
          />
          <span className="flex-1 tracking-wide">{label}</span>
          {badge && badges[badge] > 0 && (
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-secondary text-white text-[10px] font-black leading-none">
              {badges[badge]}
            </span>
          )}
          {isActive && (
            <FaChevronRight className="text-[10px] text-secondary/50 ml-auto" />
          )}
        </>
      )}
    </NavLink>
  );

  /* ── mobile bottom NavLink ── */
  const BottomLink = ({ to, label, Icon, badge }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-150 outline-none",
          isActive ? "text-secondary" : "text-white/35 hover:text-white/60",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="bottomActive"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-secondary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <div className="relative">
            <Icon className="text-lg" />
            {badge && badges[badge] > 0 && (
              <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-secondary text-white text-[8px] font-black leading-none">
                {badges[badge]}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );

  if (isAdminLoading) return <LoadingSpinner />;

  /* bottom 4 links for mobile — pick most important */
  const mobileLinks = isAdmin ? adminNav.slice(0, 4) : userNav.slice(0, 4);

  return (
    <div className="flex h-dvh bg-base-200 overflow-hidden">
      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR (lg+)
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-primary border-r border-white/6 shrink-0">
        {/* brand */}
        <Link
          to="/"
          className="group flex flex-col px-6 pt-7 pb-6 border-b border-white/[0.07]"
        >
          <span className="text-secondary font-black text-xl tracking-tight leading-none group-hover:tracking-wider transition-all duration-300">
            CAFE AZIZ
          </span>
          <span className="text-white/22 text-[8px] tracking-[0.5em] uppercase mt-1">
            {isAdmin ? "Admin Panel" : "My Dashboard"}
          </span>
        </Link>

        {/* user card */}
        <div className="mx-4 mt-5 mb-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/6">
          <div className="relative shrink-0">
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary z-10" />
            <img
              src={user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"}
              alt="avatar"
              onError={(e) => {
                e.target.src = "https://i.ibb.co/mJR9Qxc/user.png";
              }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/40"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate leading-tight">
              {user?.displayName?.split(" ")[0] || "User"}
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase text-secondary/70">
              {isAdmin ? (
                <>
                  <FaUserShield className="text-[8px]" /> Admin
                </>
              ) : (
                "Customer"
              )}
            </span>
          </div>
        </div>

        {/* nav links */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-2"
          style={{ scrollbarWidth: "none" }}
        >
          <SectionLabel>{isAdmin ? "Admin" : "Account"}</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {dashLinks.map(({ to, label, Icon, badge }) => (
              <SideLink
                key={to}
                to={to}
                label={label}
                Icon={Icon}
                badge={badge}
              />
            ))}
          </div>

          <SectionLabel>Site</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {publicNav.map(({ to, label, Icon }) => (
              <SideLink key={to} to={to} label={label} Icon={Icon} />
            ))}
          </div>
        </nav>

        {/* logout */}
        <div className="px-4 pb-6 pt-3 border-t border-white/6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
          >
            <FaSignOutAlt className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ── TOPBAR ── */}
        <header className="flex items-center gap-3 px-4 lg:px-6 h-16 bg-white border-b border-base-200 shrink-0">
          {/* mobile menu trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-primary/50 hover:text-primary hover:bg-base-200 transition-all active:scale-90"
            aria-label="Open menu"
          >
            <FaBars className="text-lg" />
          </button>

          {/* page title — derives from current path */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-sm font-black text-primary tracking-tight truncate"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {getPageTitle(pathname)}
            </h1>
            <p className="text-[10px] text-primary/35 tracking-widest uppercase font-semibold hidden sm:block">
              {isAdmin ? "Admin" : user?.displayName?.split(" ")[0] || "User"} ·
              Cafe Aziz
            </p>
          </div>

          {/* right: avatar + name */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-primary/80 leading-tight truncate max-w-28">
                {user?.displayName?.split(" ")[0] || "User"}
              </span>
              <span className="text-[9px] text-secondary font-black tracking-widest uppercase">
                {isAdmin ? "Admin" : "Customer"}
              </span>
            </div>
            <div className="relative">
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white z-10" />
              <img
                src={user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"}
                alt="avatar"
                onError={(e) => {
                  e.target.src = "https://i.ibb.co/mJR9Qxc/user.png";
                }}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/30"
              />
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {" "}
            {/* Add mode="wait" to ensure old page leaves before new one enters */}
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} // Add an exit animation
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE SIDEBAR DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-7000 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-dvh w-72 bg-primary flex flex-col z-7001 shadow-[30px_0_80px_rgba(0,0,0,0.5)] lg:hidden"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-white/[0.07]">
                <div>
                  <p className="text-secondary font-black text-lg tracking-tight leading-none">
                    CAFE AZIZ
                  </p>
                  <p className="text-white/22 text-[8px] tracking-[0.45em] uppercase mt-1">
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/45 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <FaTimes />
                </button>
              </div>

              {/* user card */}
              <div className="mx-4 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/6">
                <div className="relative shrink-0">
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary z-10" />
                  <img
                    src={user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"}
                    alt="avatar"
                    onError={(e) => {
                      e.target.src = "https://i.ibb.co/mJR9Qxc/user.png";
                    }}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/40"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-white/35 text-[10px] truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* links */}
              <nav
                className="flex-1 overflow-y-auto px-3 py-2"
                style={{ scrollbarWidth: "none" }}
              >
                <SectionLabel>{isAdmin ? "Admin" : "Account"}</SectionLabel>
                <div className="flex flex-col gap-0.5">
                  {dashLinks.map(({ to, label, Icon, badge }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.05 }}
                    >
                      <SideLink
                        to={to}
                        label={label}
                        Icon={Icon}
                        badge={badge}
                      />
                    </motion.div>
                  ))}
                </div>
                <SectionLabel>Site</SectionLabel>
                <div className="flex flex-col gap-0.5">
                  {publicNav.map(({ to, label, Icon }) => (
                    <SideLink key={to} to={to} label={label} Icon={Icon} />
                  ))}
                </div>
              </nav>

              {/* logout */}
              <div className="px-4 pb-8 pt-3 border-t border-white/6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 hover:bg-red-500/18 transition-all active:scale-95"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM NAV
          Shown only on < lg screens, sits above content
      ══════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-6000 bg-primary/97 backdrop-blur-xl border-t border-white/[0.07] flex items-stretch safe-bottom">
        {mobileLinks.map(({ to, label, Icon, badge }) => (
          <BottomLink
            key={to}
            to={to}
            label={label}
            Icon={Icon}
            badge={badge}
          />
        ))}
        {/* hamburger as last item */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 text-white/35 hover:text-white/60 transition-all"
        >
          <FaBars className="text-lg" />
          <span className="text-[9px] font-bold tracking-wide">More</span>
        </button>
      </nav>
    </div>
  );
};

/* ── derive a human title from the pathname ── */
function getPageTitle(pathname) {
  const map = {
    "/dashboard/adminHome": "Admin Dashboard",
    "/dashboard/userHome": "My Dashboard",
    "/dashboard/cart": "My Cart",
    "/dashboard/reservation": "Make a Reservation",
    "/dashboard/payment_history": "Order History",
    "/dashboard/review": "Add a Review",
    "/dashboard/bookings": "My Bookings",
    "/dashboard/addItems": "Add Menu Item",
    "/dashboard/manageItems": "Manage Menu",
    "/dashboard/allUsers": "All Users",
    "/dashboard/manageBooking": "Manage Bookings",
    "/dashboard/payment": "Payment",
  };
  return map[pathname] || "Dashboard";
}

export default Dashboard;
