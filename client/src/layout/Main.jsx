import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const Main = () => {
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    /* FIX: Added bg-primary here. This prevents the white background 
       from showing through the transparent navbar or during page transitions. */
    <div className="relative w-full bg-primary min-h-screen flex flex-col">
      {/* 1. PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.75 bg-secondary origin-left z-100001 pointer-events-none"
        style={{ scaleX }}
      />

      {/* 2. NAVBAR */}
      <Navbar />

      {/* 3. MAIN CONTENT 
          We use flex-1 to push the footer to the bottom on short pages.
          We keep z-10 so it stays below the Navbar's z-index. */}
      <main className="relative z-10 flex-1">
        {navigation.state === "loading" ? (
          <div className="h-[60vh] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div key={pathname} className="fade-in">
            <Outlet />
          </div>
        )}
      </main>

      <Footer />

      {/* 4. SCROLL BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-6000 flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-white shadow-[0_10px_30px_rgba(5,150,105,0.4)] transition-shadow hover:shadow-secondary/50"
          >
            <FaChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
