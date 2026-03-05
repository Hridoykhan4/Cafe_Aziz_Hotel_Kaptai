import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import Swal from "sweetalert2";
import useCart from "../../../../hooks/useCart";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

/* ── empty state ── */
const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 gap-5"
  >
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl bg-base-200 flex items-center justify-center">
        <FiShoppingCart className="text-4xl text-primary/20" />
      </div>
      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center text-[10px] font-black text-secondary">
        0
      </span>
    </div>
    <div className="text-center">
      <h3
        className="text-lg font-black text-primary tracking-tight mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Your cart is empty
      </h3>
      <p className="text-sm text-primary/40 max-w-xs">
        Looks like you haven't added anything yet. Explore our menu and find
        something you love.
      </p>
    </div>
    <Link
      to="/order/salad"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white text-xs font-black tracking-widest uppercase hover:bg-secondary/90 hover:shadow-[0_8px_24px_rgba(5,150,105,0.3)] active:scale-95 transition-all"
    >
      <FaUtensils className="text-xs" /> Browse Menu
    </Link>
  </motion.div>
);

/* ════════════════════════════════════════════ */
const Cart = () => {
  const { cart, refetch } = useCart();
  const axiosSecure = useAxiosSecure();

  const totalCost = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart],
  );

  const handleDelete = async (id, name) => {
    const { isConfirmed } = await Swal.fire({
      title: `Remove "${name}"?`,
      text: "This item will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, remove",
      background: "#ffffff",
      color: "#0f172a",
    });
    if (!isConfirmed) return;

    const { data } = await axiosSecure.delete(`/carts/${id}`);
    if (data?.deletedCount > 0) {
      refetch();
      Swal.fire({
        title: "Removed!",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        background: "#ffffff",
        color: "#0f172a",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary mb-1">
            My Cart
          </p>
          <h1
            className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Selection
          </h1>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-base-200 text-sm text-primary/40 font-bold">
            <FiShoppingCart className="text-secondary" />
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </div>
        )}
      </motion.div>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-base-200"
        >
          <EmptyCart />
        </motion.div>
      ) : (
        <>
          {/* ── CART ITEMS CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.06 }}
            className="bg-white rounded-2xl border border-base-200 overflow-hidden"
          >
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-base-100 border-b border-base-200">
                    {["#", "Item", "Name", "Price", "Remove"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary/35 ${i >= 4 ? "text-center" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {cart.map((item, i) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, height: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-base-100 last:border-0 hover:bg-base-100/50 transition-colors group"
                      >
                        <td className="px-5 py-4 text-primary/25 font-bold text-xs tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-base-200 shrink-0">
                            <img
                              src={item?.image}
                              alt={item?.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-bold text-primary capitalize">
                              {item?.name}
                            </p>
                            <p className="text-xs text-primary/35 capitalize">
                              {item?.category || "Food"}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-black text-primary">
                            ${item?.price}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleDelete(item._id, item?.name)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
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

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-base-100">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-4 py-4"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-base-200 shrink-0">
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary text-sm capitalize truncate">
                        {item?.name}
                      </p>
                      <p className="text-xs text-primary/35 capitalize">
                        {item?.category || "Food"}
                      </p>
                      <p className="text-sm font-black text-secondary mt-0.5">
                        ${item?.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id, item?.name)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90 shrink-0"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.14 }}
            className="bg-white rounded-2xl border border-base-200 p-5 sm:p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/35 mb-4">
              Order Summary
            </p>

            <div className="space-y-3 mb-5">
              {/* subtotal rows */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary/50 font-semibold">
                  Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})
                </span>
                <span className="font-bold text-primary">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary/50 font-semibold">
                  Service Fee
                </span>
                <span className="font-bold text-secondary text-xs">
                  Included
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary/50 font-semibold">Delivery</span>
                <span className="font-bold text-secondary text-xs">Free</span>
              </div>

              {/* divider */}
              <div className="flex items-center gap-2 pt-1">
                <span className="flex-1 border-t border-dashed border-base-300" />
              </div>

              {/* total */}
              <div className="flex items-center justify-between">
                <span className="font-black text-primary text-base">Total</span>
                <span
                  className="font-black text-primary text-2xl tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/dashboard/payment"
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-secondary text-white font-black text-xs tracking-widest uppercase hover:bg-secondary/90 hover:shadow-[0_8px_24px_rgba(5,150,105,0.3)] active:scale-95 transition-all"
              >
                Proceed to Payment
                <FiArrowRight className="text-sm" />
              </Link>
              <Link
                to="/order/salad"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border-2 border-base-200 text-primary/50 font-black text-xs tracking-widest uppercase hover:border-secondary/30 hover:text-primary active:scale-95 transition-all"
              >
                <FaUtensils className="text-xs" /> Add More
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Cart;
