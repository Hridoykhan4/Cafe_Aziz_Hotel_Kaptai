import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import useMenu from "../../../../hooks/useMenu";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const LIMIT = 8;

const CAT_COLORS = {
  salad: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-400",
  },
  pizza: { bg: "bg-orange-50", text: "text-orange-500", dot: "bg-orange-400" },
  soup: { bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-400" },
  dessert: { bg: "bg-pink-50", text: "text-pink-500", dot: "bg-pink-400" },
  drinks: { bg: "bg-violet-50", text: "text-violet-500", dot: "bg-violet-400" },
};

const CategoryBadge = ({ cat }) => {
  const style = CAT_COLORS[cat?.toLowerCase()] || {
    bg: "bg-base-200",
    text: "text-primary/40",
    dot: "bg-primary/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {cat}
    </span>
  );
};

const ManageItems = () => {
  const [page, setPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  const { menu, refetch, totalPages, total, loading } = useMenu({
    forMangeItems: true,
    limit: LIMIT,
    page,
  });

  const handleDelete = async (id, name) => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This item will be permanently removed from the menu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete",
      background: "#ffffff",
      color: "#0f172a",
    });
    if (!isConfirmed) return;

    const { data } = await axiosSecure.delete(`/menu/${id}`);
    if (data?.deletedCount) {
      if (menu?.length === 1 && page > 1) setPage((p) => p - 1);
      else refetch();
      Swal.fire({
        title: "Deleted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (loading) return <LoadingSpinner />;

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
            Menu Management
          </p>
          <h1
            className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Manage Items
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-base-200 text-sm text-primary/40 font-bold">
            <FaUtensils className="text-secondary text-xs" />
            {total} items
          </div>
          <Link
            to="/dashboard/addItems"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-black tracking-widest uppercase hover:bg-secondary/90 active:scale-95 transition-all"
          >
            + Add Item
          </Link>
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="bg-white rounded-2xl border border-base-200 overflow-hidden"
      >
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-base-100 border-b border-base-200">
                {["#", "Item", "Category", "Price", "Edit", "Delete"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary/35 ${i >= 4 ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {menu?.map((item, idx) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-base-100 hover:bg-base-100/60 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-primary/25 font-bold text-xs tabular-nums">
                      {String((page - 1) * LIMIT + idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-base-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <span className="font-semibold text-primary capitalize truncate max-w-48">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <CategoryBadge cat={item.category} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-primary">
                        ${item.price}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/dashboard/updateItems/${item._id}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all active:scale-90"
                        title="Edit"
                      >
                        <FiEdit2 className="text-sm" />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                        title="Delete"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-base-100">
          {menu?.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 px-4 py-4"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-base-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary text-sm capitalize truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge cat={item.category} />
                  <span className="text-xs font-black text-primary">
                    ${item.price}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Link
                  to={`/dashboard/updateItems/${item._id}`}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all active:scale-90"
                >
                  <FiEdit2 className="text-sm" />
                </Link>
                <button
                  onClick={() => handleDelete(item._id, item.name)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {menu?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FiPackage className="text-3xl text-primary/15" />
            <p className="text-primary/30 text-sm font-semibold">
              No items found
            </p>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-base-200 flex-wrap">
            <p className="text-xs font-semibold text-primary/35">
              Page <span className="text-primary font-black">{page}</span> of{" "}
              <span className="text-primary font-black">{totalPages}</span>
              <span className="ml-2 text-primary/25">
                · {total} total items
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-base-200 text-primary/40 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <FiChevronLeft className="text-sm" />
              </button>

              {/* page number pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (n) =>
                      n === 1 || n === totalPages || Math.abs(n - page) <= 1,
                  )
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "…" ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-1 text-primary/25 text-xs"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={[
                          "w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-90",
                          n === page
                            ? "bg-secondary text-white shadow-sm"
                            : "text-primary/40 hover:bg-base-200",
                        ].join(" ")}
                      >
                        {n}
                      </button>
                    ),
                  )}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-base-200 text-primary/40 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <FiChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageItems;
