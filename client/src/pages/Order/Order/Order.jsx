import { useMemo, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Cover from "../../Shared/Cover/Cover";
import useMenu from "../../../hooks/useMenu";
import FoodCard from "../../../components/FoodCard/FoodCard";
import orderCover from "../../../assets/shop/order.jpg";

const categories = ["salad", "pizza", "soup", "dessert", "drinks"];

const categoryMeta = {
  salad: { emoji: "🥗", label: "Salad" },
  pizza: { emoji: "🍕", label: "Pizza" },
  soup: { emoji: "🍜", label: "Soup" },
  dessert: { emoji: "🍰", label: "Dessert" },
  drinks: { emoji: "🥤", label: "Drinks" },
};

const Order = () => {
  const navigate = useNavigate();
  const { category = "salad" } = useParams();
  const { menu } = useMenu();
  const tabsRef = useRef(null);

  const activeCategory = categories.includes(category.toLowerCase())
    ? category.toLowerCase()
    : "salad";

  const categorizedMenu = useMemo(
    () => menu.filter((item) => item.category === activeCategory),
    [menu, activeCategory],
  );

  const handleTabClick = useCallback(
    (cat) => {
      if (cat === activeCategory) return;

      // Anchor viewport to tab bar synchronously BEFORE navigate.
      // Main.jsx no longer fires scroll-to-top for same base (/order),
      // so there is no race condition here.
      if (tabsRef.current) {
        const NAVBAR_H = 80;
        const top =
          tabsRef.current.getBoundingClientRect().top +
          window.scrollY -
          NAVBAR_H;
        window.scrollTo({ top, behavior: "instant" });
      }

      navigate(`/order/${cat}`, { replace: true, preventScrollReset: true });
    },
    [activeCategory, navigate],
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-base-100 min-h-screen pb-24"
    >
      <Cover
        img={orderCover}
        title="Order Online"
        desc="Gourmet flavors delivered to your doorstep"
      />

      <div className="app-container mt-12">
        {/* ── TAB BAR ── */}
        <div ref={tabsRef} className="flex justify-center mb-10 md:mb-14">
          {/* Desktop pill strip */}
          <nav
            className="hidden sm:flex items-center gap-1 p-1.5 bg-base-200 rounded-full border border-base-300"
            aria-label="Menu categories"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleTabClick(cat)}
                  className="relative px-6 py-2.5 md:px-8 md:py-3 rounded-full outline-none select-none cursor-pointer transition-colors duration-150 no-tap-highlight"
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 bg-secondary rounded-full shadow-md shadow-secondary/25"
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span
                    className={[
                      "relative z-10 flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.18em] transition-colors duration-150",
                      isActive
                        ? "text-white"
                        : "text-primary/40 hover:text-primary/70",
                    ].join(" ")}
                  >
                    <span>{categoryMeta[cat].emoji}</span>
                    {categoryMeta[cat].label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Mobile 3+2 grid */}
          <div
            className="sm:hidden grid grid-cols-3 gap-2 w-full max-w-xs"
            role="tablist"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleTabClick(cat)}
                  role="tab"
                  aria-selected={isActive}
                  className={[
                    "flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-200 active:scale-95 outline-none select-none",
                    isActive
                      ? "bg-secondary border-secondary text-white shadow-md shadow-secondary/30"
                      : "bg-base-200 border-base-300 text-primary/45",
                  ].join(" ")}
                >
                  <span className="text-xl leading-none">
                    {categoryMeta[cat].emoji}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                    {categoryMeta[cat].label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FOOD GRID ── */}
        <div className="min-h-96">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {categorizedMenu.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {categorizedMenu.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                    >
                      <FoodCard item={item} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-28 gap-3">
                  <span className="text-5xl opacity-20">
                    {categoryMeta[activeCategory]?.emoji}
                  </span>
                  <p className="font-heading italic text-primary/30 tracking-widest uppercase text-sm">
                    Preparing our {activeCategory} selection…
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default Order;
