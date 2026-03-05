import { motion } from "framer-motion";
import { useState } from "react";
import { FiShoppingCart, FiInfo } from "react-icons/fi";
import useAuthValue from "../../hooks/useAuthValue";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useCart from "../../hooks/useCart";

const FoodCard = ({ item }) => {
  const axiosSecure = useAxiosSecure();
  const { refetch } = useCart();
  const { name, price, recipe, image, _id } = item || {};
  const { user } = useAuthValue();
  const location = useLocation();
  const nav = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const handleAddToCart = async () => {
    if (!user?.email) {
      nav("/login", { state: { from: location } });
      return;
    }

    const result = await Swal.fire({
      title: `Add to cart?`,
      html: `<span style="font-size:0.9rem;color:#64748b">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, add it!",
      background: "#ffffff",
      color: "#0f172a",
    });

    if (!result.isConfirmed) return;

    const cartItem = {
      menuId: _id,
      email: user.email,
      name,
      image,
      price,
      orderStatus: "pending",
    };

    try {
      const { data } = await axiosSecure.post("/carts", cartItem);
      if (data?.insertedId) {
        Swal.fire({
          title: "Added!",
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
          background: "#ffffff",
          color: "#0f172a",
        });
        refetch();
      }
    } catch (err) {
      if (err?.response?.data?.exists) {
        Swal.fire({
          title: "Already in cart",
          icon: "info",
          timer: 1400,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-base-200 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/8 transition-all duration-500"
    >
      {/* ── Image ── */}
      <div className="relative h-56 overflow-hidden bg-base-200 shrink-0">
        {!imgErr ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* graceful fallback if image 404s */
          <div className="w-full h-full flex items-center justify-center bg-base-300">
            <FiInfo className="text-3xl text-base-content/20" />
          </div>
        )}

        {/* price badge */}
        <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-xs font-black tracking-widest shadow-md">
          ${price}
        </div>

        {/* hover tint */}
        <div className="absolute inset-0 bg-linear-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 text-center">
        {/* name */}
        <h2 className="font-heading font-bold text-primary text-base uppercase tracking-tight mb-2 line-clamp-1">
          {name}
        </h2>

        {/* recipe description */}
        <p className="text-primary/50 text-xs leading-relaxed italic line-clamp-2 mb-5 flex-1">
          {recipe}
        </p>

        {/* divider */}
        <div className="flex items-center gap-2 mb-5">
          <span className="flex-1 border-t border-dashed border-base-300" />
          <span className="text-secondary font-black text-sm">${price}</span>
          <span className="flex-1 border-t border-dashed border-base-300" />
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className="group/btn w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border-2 border-secondary text-secondary font-black text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:bg-secondary hover:text-white active:scale-95 shadow-sm hover:shadow-md hover:shadow-secondary/25"
        >
          <FiShoppingCart className="text-sm transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
