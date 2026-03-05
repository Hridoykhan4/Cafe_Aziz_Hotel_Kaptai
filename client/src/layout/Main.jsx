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
    /* h-full is safer than min-h-screen for sticky stability */
    <div className="relative w-full">
      {/* 1. PROGRESS BAR - Must be top-level */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-secondary origin-left z-[9999] pointer-events-none"
        style={{ scaleX }}
      />

      {/* 2. NAVBAR - Positioned absolutely at the top level of the body */}
      <Navbar />

      {/* 3. MAIN CONTENT - Added pt-0 to ensure it goes UNDER the transparent nav */}
      <main className="relative z-10">
        {navigation.state === "loading" ? (
          <div className="h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          /* FIX: Removed the motion.div wrapper around Outlet. 
             The 'fade-in' class from your CSS is safer than Framer Motion 
             for the main layout container to prevent breaking 'fixed' children. */
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[6000] flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-white shadow-2xl"
          >
            <FaChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
