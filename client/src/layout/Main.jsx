import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

// Shared Components
import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = () => {
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Cinematic Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 2. Optimized Scroll Behavior
  useEffect(() => {
    // Immediate scroll to top on path change (prevents seeing bottom of new page)
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 3. Logic to identify if we are in a "Loading State" (for UX)
  const isLoading = useMemo(
    () => navigation.state === "loading",
    [navigation.state],
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-base-100 selection:bg-secondary/20 selection:text-secondary-content">
      {/* ── TOP ORCHESTRATION ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-99999 pointer-events-none"
        style={{ scaleX }}
      />

      <Navbar />

      {/* ── PAGE TRANSITION WRAPPER ── */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm min-h-[60vh]"
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* ── INTERACTIVE ELEMENTS ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{
              y: -5,
              backgroundColor: "var(--color-secondary)",
              boxShadow: "0 20px 40px rgba(5,150,105,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-8 right-8 z-90 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl transition-colors border border-white/10"
          >
            <FaChevronUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
