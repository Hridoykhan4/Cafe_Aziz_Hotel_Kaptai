import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";

/* ═══════════════════════════════════════════════════════════════════
   ROOT CAUSES FIXED:

   [1] BLANK / RELOAD-TO-SEE-CONTENT
   ───────────────────────────────────
   Old Main.jsx used AnimatePresence mode="sync/wait" with key={baseRoute}.
   Lazy-loaded pages are wrapped in Suspense (via Loadable in router.jsx).
   When you navigate to a new route, the sequence was:
     a) AnimatePresence starts EXIT animation on old page (opacity fades)
     b) React Router swaps the Outlet
     c) Suspense fires its fallback (<LoadingSpinner />) while the chunk
        downloads — this happens MID-exit-animation
     d) The page is now blank/spinner while framer-motion chunk also loads
     e) Chunk arrives, page renders, but AnimatePresence ENTER fires again
   Result: old page gone → white flash → spinner → content appears.
   
   THE FIX: Remove AnimatePresence from the Outlet entirely.
   Individual pages handle their own entrance animations.
   The Outlet just renders — no wrapper animation, no key changes,
   no fight with Suspense. Zero blink.

   [2] SCROLL-TO-TOP FIGHTING ORDER TABS
   ──────────────────────────────────────
   useEffect fired scrollTo(0,0) on every pathname change.
   /order/salad → /order/pizza both have base "order" → same base → skip.
   useRef tracks previous base for stable comparison across renders.

   [3] GHOST SCROLLBAR ON DRAWER OPEN
   ────────────────────────────────────
   Listens for "drawer-state" CustomEvent from Navbar.
   Locks BOTH html + body (not just body) to kill the scrollbar-gutter.
═══════════════════════════════════════════════════════════════════ */

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

  // [FIX 2] Only scroll to top when the actual page changes
  useEffect(() => {
    const curr = getBase(pathname);
    if (curr !== prevBaseRef.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevBaseRef.current = curr;
    }
  }, [pathname]);

  // Scroll-to-top button visibility
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // [FIX 3] Lock both html + body for drawer (kills ghost scrollbar gutter)
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
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-secondary origin-left pointer-events-none"
        style={{ scaleX, zIndex: 99998 }}
      />

      <Navbar />

      {/* [FIX 1] No AnimatePresence wrapper. No key. No exit animation.
          Individual pages animate their own content in.
          Suspense (from Loadable) can fire freely without fighting
          any exit animation — zero white flash. */}
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
