import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import {
  FaCheck, FaTimes, FaChevronDown, FaChevronUp,
  FaCalendarAlt, FaShoppingBag,
} from "react-icons/fa";
import { FiUser, FiMail, FiClock, FiPackage } from "react-icons/fi";
import Swal from "sweetalert2";

/* ── status config ── */
const STATUS = {
  pending:   { bg: "bg-sky-50",    text: "text-sky-600",   dot: "bg-sky-400",   label: "Pending"   },
  confirmed: { bg: "bg-emerald-50",text: "text-emerald-600",dot: "bg-emerald-400",label: "Confirmed" },
  canceled:  { bg: "bg-red-50",    text: "text-red-500",   dot: "bg-red-400",   label: "Canceled"  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

/* ── ordered items panel shown inline ── */
const OrderedItemsPanel = ({ menuItemIds, axiosSecure }) => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["orderedItems", menuItemIds?.join(",")],
    queryFn: async () => {
      const { data } = await axiosSecure.post("/orderedItems", { ids: menuItemIds });
      return data;
    },
    enabled: !!menuItemIds?.length,
    staleTime: 60_000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-6">
      <div className="w-5 h-5 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {items.map(item => (
        <div key={item._id} className="bg-white rounded-xl border border-base-200 overflow-hidden">
          <div className="h-28 overflow-hidden bg-base-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
          <div className="p-3">
            <p className="text-xs font-bold text-primary capitalize truncate">{item.name}</p>
            <p className="text-[10px] text-primary/40 capitalize mt-0.5">{item.category}</p>
            <p className="text-sm font-black text-secondary mt-1">${item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════ */
const ManageBookings = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [expandedId, setExpandedId] = useState(null);

  const { data: allBookings = [], isPending } = useQuery({
    queryKey: ["manageBookings"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/payments");
      return data;
    },
  });

  const { mutateAsync, isPending: statusPending } = useMutation({
    mutationFn: async ({ prevStatus, status, id }) => {
      if (prevStatus === status) return;
      const { data } = await axiosSecure.patch(`/order-status/${id}`, { status });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["manageBookings"]);
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
      if (data?.modifiedCount) {
        Swal.fire({
          title: "Status updated!",
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
          background: "#ffffff",
          color: "#0f172a",
        });
      }
    },
    onError: err => {
      Swal.fire({ title: "Update failed", text: err.message, icon: "error" });
    },
  });

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  /* summary counts */
  const counts = allBookings.reduce((acc, b) => {
    acc[b.status || "pending"] = (acc[b.status || "pending"] || 0) + 1;
    return acc;
  }, {});

  if (isPending) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary mb-1">
            Orders
          </p>
          <h1 className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            Manage Bookings
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "pending",   ...STATUS.pending   },
            { key: "confirmed", ...STATUS.confirmed },
            { key: "canceled",  ...STATUS.canceled  },
          ].map(({ key, bg, text, dot, label }) => (
            <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bg} ${text} text-xs font-black`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {counts[key] || 0} {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="bg-white rounded-2xl border border-base-200 overflow-hidden"
      >

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-base-100 border-b border-base-200">
                {["#", "Customer", "Time", "Items · Price", "Status", "Actions", ""].map((h, i) => (
                  <th key={i} className={`px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-primary/35 ${i === 5 ? "text-center" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking, i) => (
                <>
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-base-100 transition-colors ${expandedId === booking._id ? "bg-base-100/80" : "hover:bg-base-100/50"}`}
                  >
                    <td className="px-4 py-4 text-primary/25 font-bold text-xs tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-bold text-primary text-xs truncate max-w-40">{booking?.name || "Guest"}</p>
                        <p className="text-[10px] text-primary/40 truncate max-w-40">{booking?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-primary/50">
                        <span className="font-semibold">
                          {new Date(booking?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="text-primary/30">
                          {new Date(booking?.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary/60">
                          {booking?.menuItemIds?.length} item{booking?.menuItemIds?.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-primary/20">·</span>
                        <span className="text-xs font-black text-secondary">${booking?.price}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={booking?.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          disabled={statusPending || booking?.status === "confirmed"}
                          onClick={() => mutateAsync({ prevStatus: booking?.status, status: "confirmed", id: booking._id })}
                          title="Confirm"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                          <FaCheck className="text-xs" />
                        </button>
                        <button
                          disabled={statusPending || booking?.status === "canceled"}
                          onClick={() => mutateAsync({ prevStatus: booking?.status, status: "canceled", id: booking._id })}
                          title="Cancel"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    </td>
                    {/* expand toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleExpand(booking._id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          expandedId === booking._id
                            ? "bg-secondary text-white"
                            : "bg-base-200 text-primary/40 hover:bg-secondary/10 hover:text-secondary"
                        }`}
                      >
                        <FiPackage className="text-xs" />
                        {expandedId === booking._id
                          ? <FaChevronUp className="text-[8px]" />
                          : <FaChevronDown className="text-[8px]" />}
                      </button>
                    </td>
                  </motion.tr>

                  {/* ── INLINE EXPANDED ITEMS ROW ── */}
                  <AnimatePresence>
                    {expandedId === booking._id && (
                      <motion.tr
                        key={`expand-${booking._id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={7} className="p-0 border-b border-base-200">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden bg-base-100/60"
                          >
                            <div className="px-4 pt-3 pb-1">
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/30 mb-2">
                                Ordered Items — {booking.menuItemIds?.length} items · ${booking.price}
                              </p>
                            </div>
                            <OrderedItemsPanel
                              menuItemIds={booking.menuItemIds}
                              axiosSecure={axiosSecure}
                            />
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="lg:hidden divide-y divide-base-100">
          {allBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-4">
                {/* top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-primary/25 tabular-nums">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                      <StatusBadge status={booking?.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary/50 mb-0.5">
                      <FiUser className="text-[10px] shrink-0" />
                      <span className="font-semibold truncate">{booking?.name || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary/35 mb-0.5">
                      <FiMail className="text-[10px] shrink-0" />
                      <span className="truncate">{booking?.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary/35">
                      <FiClock className="text-[10px] shrink-0" />
                      <span>
                        {new Date(booking?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" "}·{" "}
                        {new Date(booking?.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-black text-secondary">${booking?.price}</p>
                    <p className="text-[10px] text-primary/30 font-semibold">{booking?.menuItemIds?.length} items</p>
                  </div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={statusPending || booking?.status === "confirmed"}
                    onClick={() => mutateAsync({ prevStatus: booking?.status, status: "confirmed", id: booking._id })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black hover:bg-emerald-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <FaCheck className="text-[10px]" /> Confirm
                  </button>
                  <button
                    disabled={statusPending || booking?.status === "canceled"}
                    onClick={() => mutateAsync({ prevStatus: booking?.status, status: "canceled", id: booking._id })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-400 text-xs font-black hover:bg-red-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <FaTimes className="text-[10px]" /> Cancel
                  </button>
                  <button
                    onClick={() => toggleExpand(booking._id)}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      expandedId === booking._id
                        ? "bg-secondary text-white"
                        : "bg-base-200 text-primary/50"
                    }`}
                  >
                    <FiPackage />
                    {expandedId === booking._id ? <FaChevronUp className="text-[8px]" /> : <FaChevronDown className="text-[8px]" />}
                  </button>
                </div>
              </div>

              {/* inline expand */}
              <AnimatePresence>
                {expandedId === booking._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-base-200 bg-base-100/50"
                  >
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/30 mb-2">
                        Items in this order
                      </p>
                    </div>
                    <OrderedItemsPanel
                      menuItemIds={booking.menuItemIds}
                      axiosSecure={axiosSecure}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {allBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FaCalendarAlt className="text-3xl text-primary/15" />
            <p className="text-primary/30 text-sm font-semibold">No bookings yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageBookings;