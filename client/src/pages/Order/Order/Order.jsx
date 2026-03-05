import { useMemo, useRef, useCallback, useEffect } from "react";
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

  // PREVENT GLOBAL SCROLL JUMP
  // This effectively overrides any ScrollToTop components for this route
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  const handleTabClick = useCallback(
    (cat) => {
      if (cat === activeCategory) return;

      // Professional Scroll Anchor:
      // Calculate exactly where the user is and stay there.
      if (tabsRef.current) {
        const navbarHeight = 85;
        const elementPosition =
          tabsRef.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth", // Smooth feel for a premium site
        });
      }

      // Small delay to let the smooth scroll begin before the URL change
      setTimeout(() => {
        navigate(`/order/${cat}`, { replace: true });
      }, 50);
    },
    [activeCategory, navigate],
  );

  return (
    <section className="bg-base-100 min-h-screen pb-24 selection:bg-secondary/20">
      <Cover
        img={orderCover}
        title="Order Online"
        desc="Gourmet flavors delivered to your doorstep"
      />

      <div className="app-container mt-12" ref={tabsRef}>
        {/* ── NEXT-LEVEL TAB NAVIGATION ── */}
        <div className="flex justify-center mb-16">
          <nav className="inline-flex items-center p-1.5 bg-base-200/50 backdrop-blur-xl rounded-full border border-base-300 overflow-hidden">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleTabClick(cat)}
                  className="relative px-6 py-3 md:px-10 md:py-4 rounded-full cursor-pointer outline-none select-none no-tap-highlight group"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 bg-secondary rounded-full shadow-lg shadow-secondary/30"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 font-heading font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-primary/40 group-hover:text-primary/70"
                    }`}
                  >
                    <span className="hidden md:inline">
                      {categoryMeta[cat].emoji}
                    </span>
                    {categoryMeta[cat].label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── CONTENT GRID WITH POP-LAYOUT ── */}
        <div className="relative min-h-150">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {categorizedMenu.length > 0 ? (
                  categorizedMenu.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <FoodCard item={item} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center opacity-30">
                    <p className="font-heading italic tracking-[0.3em] uppercase text-sm">
                      Refining Selection...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Order;
