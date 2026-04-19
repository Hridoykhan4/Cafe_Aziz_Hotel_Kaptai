import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";

const getBase = (p) => p.split("/").filter(Boolean)[0] || "home";

const Main = () => {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);
  const prevBaseRef = useRef(getBase(pathname));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const curr = getBase(pathname);
    if (curr !== prevBaseRef.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevBaseRef.current = curr;
    }
  }, [pathname]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      const locked = e.detail?.locked ?? false;
      document.documentElement.style.overflow = locked ? "hidden" : "";
      document.body.style.overflow = locked ? "hidden" : "";
    };
    window.addEventListener("drawer-state", fn);
    return () => window.removeEventListener("drawer-state", fn);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-base-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-secondary origin-left pointer-events-none"
        style={{ scaleX, zIndex: 99998 }}
      />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(5,150,105,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            style={{ zIndex: 9000 }}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl border border-white/10 hover:bg-secondary transition-colors"
          >
            <FaChevronUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
