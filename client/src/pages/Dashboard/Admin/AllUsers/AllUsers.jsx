import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useUsers from "../../../../hooks/useUsers";
import {
  FaTrash,
  FaUserShield,
  FaUser,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

/* ── palette ── */
const P = {
  primary: "#0f172a",
  secondary: "#059669",
  rose: "#e11d48",
  amber: "#d97706",
};

/* ── role badge ── */
const RoleBadge = ({ role }) =>
  role === "admin" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase">
      <FaUserShield className="text-[9px]" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200 text-primary/40 text-[10px] font-black tracking-widest uppercase">
      <FaUser className="text-[9px]" /> User
    </span>
  );

/* ════════════════════════════════════════════ */
const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], isLoading, isError, error, refetch } = useUsers();
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u?.name?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Remove ${name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: P.rose,
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, remove",
      background: "#ffffff",
      color: P.primary,
    });
    if (!result.isConfirmed) return;
    try {
      const { data } = await axiosSecure.delete(`/users/${id}`);
      if (data?.deletedCount) {
        refetch();
        Swal.fire({
          title: "Removed!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({ title: err?.message || "Error", icon: "error" });
    }
  };

  const handleMakeAdmin = async (id, name) => {
    const result = await Swal.fire({
      title: `Promote ${name}?`,
      text: `${name} will gain admin privileges.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: P.secondary,
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, promote",
      background: "#ffffff",
      color: P.primary,
    });
    if (!result.isConfirmed) return;
    try {
      const { data } = await axiosSecure.patch(`/users/admin/${id}`);
      if (data?.modifiedCount) {
        refetch();
        Swal.fire({
          title: `${name} is now Admin!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({ title: err?.message || "Error", icon: "error" });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 font-semibold">{String(error)}</p>
      </div>
    );

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
            Management
          </p>
          <h1
            className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Users
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-base-200 text-sm text-primary/40">
          <FaUsers className="shrink-0" />
          <span className="font-bold">{users.length} total</span>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="relative max-w-sm"
      >
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 text-sm pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-base-200 bg-white text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
        />
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="bg-white rounded-2xl border border-base-200 overflow-hidden"
      >
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-base-100 border-b border-base-200">
                {["#", "User", "Email", "Role", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.22em] text-primary/35 ${h === "Actions" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-base-100 hover:bg-base-100/60 transition-colors"
                  >
                    <td className="px-5 py-4 text-primary/30 font-bold text-xs tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                          <span className="text-secondary font-black text-sm">
                            {(user?.name || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-primary truncate max-w-36">
                          {user?.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-primary/50 truncate max-w-48">
                      {user?.email}
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={user?.role} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user?.role !== "admin" && (
                          <button
                            onClick={() => handleMakeAdmin(user._id, user.name)}
                            title="Promote to Admin"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-black hover:bg-secondary hover:text-white transition-all active:scale-95"
                          >
                            <FaUserShield className="text-[10px]" /> Promote
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id, user?.name)}
                          title="Delete user"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-base-100">
          <AnimatePresence>
            {filtered.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-4"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="text-secondary font-black">
                    {(user?.name || "?")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">
                    {user?.name || "—"}
                  </p>
                  <p className="text-primary/40 text-xs truncate">
                    {user?.email}
                  </p>
                  <div className="mt-1.5">
                    <RoleBadge role={user?.role} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {user?.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id, user.name)}
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all active:scale-90"
                    >
                      <FaUserShield className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id, user?.name)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FaUsers className="text-3xl text-primary/15" />
            <p className="text-primary/30 text-sm font-semibold">
              No users found
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllUsers;
