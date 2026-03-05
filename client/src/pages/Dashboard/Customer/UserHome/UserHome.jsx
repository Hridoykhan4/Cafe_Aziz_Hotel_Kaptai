import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import {
  FaShoppingBag, FaStar, FaBook, FaMoneyBillWave,
  FaUtensils, FaCreditCard, FaArrowRight,
} from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

/* ── stat card config ── */
const STATS = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: FaShoppingBag,
    color: "#059669",    // secondary
    bg: "#05966912",
    suffix: "",
    link: "/dashboard/payment_history",
  },
  {
    key: "totalPaid",
    label: "Total Spent",
    icon: FaMoneyBillWave,
    color: "#4f46e5",
    bg: "#4f46e512",
    prefix: "$",
    link: "/dashboard/payment_history",
  },
  {
    key: "reviewCount",
    label: "Reviews Left",
    icon: FaStar,
    color: "#d97706",
    bg: "#d9770612",
    link: "/dashboard/review",
  },
  {
    key: "bookings",
    label: "Reservations",
    icon: FaBook,
    color: "#0891b2",
    bg: "#0891b212",
    link: "/dashboard/bookings",
  },
  {
    key: "totalPayments",
    label: "Payments Made",
    icon: FaCreditCard,
    color: "#e11d48",
    bg: "#e11d4812",
    link: "/dashboard/payment_history",
  },
  {
    key: "menuItems",
    label: "Menu Items",
    icon: FaUtensils,
    color: "#7c3aed",
    bg: "#7c3aed12",
    link: "/menu",
  },
];

/* ── quick action cards ── */
const ACTIONS = [
  { label: "Browse Menu",       to: "/menu",                   icon: FaUtensils,      color: "#059669" },
  { label: "Order Food",        to: "/order/salad",            icon: FaShoppingBag,   color: "#4f46e5" },
  { label: "Make Reservation",  to: "/dashboard/reservation",  icon: FaBook,          color: "#d97706" },
  { label: "Leave a Review",    to: "/dashboard/review",       icon: FaStar,          color: "#e11d48" },
];

/* ── stat card ── */
const StatCard = ({ stat, value, delay }) => {
  const { label, icon: Icon, color, bg, prefix = "", suffix = "", link } = stat;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={link}
        className="group flex flex-col gap-3 p-4 bg-white rounded-2xl border border-base-200 hover:border-transparent hover:shadow-lg transition-all duration-300"
        style={{ "--hover-shadow": `0 8px 24px ${color}18` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: bg }}>
            <Icon className="text-sm" style={{ color }} />
          </div>
          <FaArrowRight className="text-xs text-primary/15 group-hover:text-primary/40 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35 mb-0.5">{label}</p>
          <p className="text-2xl font-black text-primary tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            {prefix}{value ?? 0}{suffix}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

/* ════════════════════════════════════════════ */
const UserHome = () => {
  const { user, loading } = useAuthValue();
  const axiosSecure       = useAxiosSecure();

  const { data: stats = {}, isPending } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/user-stats?email=${user?.email}`);
      return data;
    },
    enabled: !!user && !loading,
  });

  if (isPending) return <LoadingSpinner />;

  const firstName  = user?.displayName?.split(" ")[0] || "there";
  const spendRatio = stats.menuItems
    ? Math.min(100, Math.round((stats.totalOrders / stats.menuItems) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary mb-1">
            My Dashboard
          </p>
          <h1 className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-primary/40 mt-0.5">
            Here's a summary of your activity at Cafe Aziz.
          </p>
        </div>

        {/* date */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-base-200 text-sm font-semibold text-primary/40 shrink-0 self-start">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </motion.div>

      {/* ── PROFILE + SPEND CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.06 }}
        className="bg-white rounded-2xl border border-base-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
      >
        {/* avatar */}
        <div className="relative shrink-0">
          <img
            src={user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"}
            alt="avatar"
            onError={e => { e.target.src = "https://i.ibb.co/mJR9Qxc/user.png"; }}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-secondary/20"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
        </div>

        {/* info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h2 className="text-lg font-black text-primary tracking-tight">{user?.displayName || "Guest"}</h2>
          <p className="text-sm text-primary/40 truncate">{user?.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Customer
          </span>
        </div>

        {/* spend meter */}
        <div className="w-full sm:w-48 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
              <FiTrendingUp className="inline mr-1" />
              Order Activity
            </p>
            <span className="text-xs font-black text-secondary">{spendRatio}%</span>
          </div>
          <div className="h-2 bg-base-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spendRatio}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
          <p className="text-[10px] text-primary/25 mt-1.5">
            {stats.totalOrders || 0} orders of {stats.menuItems || 0} items tried
          </p>

          <div className="mt-4 pt-4 border-t border-base-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/30">Total Spent</p>
              <p className="text-xl font-black text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                ${stats.totalPaid || 0}
              </p>
            </div>
            <Link
              to="/dashboard/payment"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-white text-[10px] font-black tracking-widest uppercase hover:bg-secondary/90 active:scale-95 transition-all"
            >
              Pay Now <FaArrowRight className="text-[8px]" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── STAT GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <StatCard
            key={stat.key}
            stat={stat}
            value={stats[stat.key]}
            delay={0.1 + i * 0.06}
          />
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.45 }}
        className="bg-white rounded-2xl border border-base-200 p-5 sm:p-6"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/35 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIONS.map(({ label, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-base-200 hover:border-transparent transition-all duration-200 active:scale-95"
              style={{ background: "transparent" }}
              onMouseEnter={e => e.currentTarget.style.background = `${color}08`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group-hover:scale-110"
                style={{ background: `${color}15` }}>
                <Icon className="text-sm" style={{ color }} />
              </div>
              <span className="text-[11px] font-bold text-primary/60 group-hover:text-primary text-center leading-tight transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserHome;