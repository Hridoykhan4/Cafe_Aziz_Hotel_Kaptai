import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import useAdmin from "../../../hooks/useAdmin";

import img1 from "../../../assets/home/banner.webp";
import img2 from "../../../assets/home/banner2.avif";
import img3 from "../../../assets/home/banner3.jpg";
import img4 from "../../../assets/home/banner4.jpg";
import img5 from "../../../assets/home/banner5.jpg";

/* ─────────────────────────────────────────────
   cta.to is a function(isAdmin, user) => string
   so every slide can make smart routing decisions
───────────────────────────────────────────── */
const slides = [
  {
    img: img1,
    eyebrow: "Welcome to Cafe Aziz",
    headline: ["Taste the", "Tradition"],
    sub: "Authentic flavors crafted with passion — every plate tells a story.",
    cta: {
      label: "Explore Menu",
      to: () => "/menu",
    },
    accent: "from-emerald-900/60",
  },
  {
    img: img2,
    eyebrow: "Handpicked Ingredients",
    headline: ["Fresh Every", "Morning"],
    sub: "Farm-to-table freshness. No shortcuts, no compromises.",
    cta: {
      label: "Order Now",
      to: () => "/order/salad",
    },
    accent: "from-slate-900/60",
  },
  {
    img: img3,
    eyebrow: "Dine With Us",
    headline: ["Peaceful", "Ambiance"],
    sub: "A serene escape where great food meets genuine hospitality.",
    cta: {
      label: "Reserve a Table",
      /* guest → login | admin → manage bookings | customer → reservation */
      to: (isAdmin, user) =>
        !user
          ? "/login"
          : isAdmin
            ? "/dashboard/manageBooking"
            : "/dashboard/reservation",
    },
    accent: "from-amber-900/60",
  },
  {
    img: img4,
    eyebrow: "Chef's Specials",
    headline: ["Crafted with", "Heart"],
    sub: "Signature dishes that keep our guests coming back.",
    cta: {
      label: "View Specials",
      to: () => "/menu",
    },
    accent: "from-rose-900/50",
  },
  {
    img: img5,
    eyebrow: "Trusted Service",
    headline: ["Your Comfort,", "Our Promise"],
    sub: "From first bite to last sip — we're here for you.",
    cta: {
      label: "Contact Us",
      to: () => "/contact",
    },
    accent: "from-cyan-900/50",
  },
];

const INTERVAL = 6000;

/* ── fallback when image fails to load ── */
const Fallback = () => (
  <div className="absolute inset-0 bg-primary">
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 40%, #059669 0%, transparent 55%), radial-gradient(circle at 75% 70%, #0f766e 0%, transparent 50%)",
      }}
    />
  </div>
);

/* ── per-slide image with graceful fallback ── */
const SlideImage = ({ src, accent }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="absolute inset-0">
      {!errored ? (
        <>
          {!loaded && <Fallback />}
          <motion.img
            key={src}
            src={src}
            alt=""
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.08 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </>
      ) : (
        <Fallback />
      )}

      {/* gradient overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t ${accent} via-black/30 to-black/40`}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════════════
   BANNER
════════════════════════════════════════════ */
const Banner = () => {
  const { user } = useAuthValue();
  const { isAdmin } = useAdmin();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const go = useCallback(
    (dir) => setIndex((prev) => (prev + dir + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), INTERVAL);
    return () => clearInterval(t);
  }, [paused, go, index]);

  const slide = slides[index];
  const ctaPath = slide.cta.to(isAdmin, user);

  return (
    <section
      className="relative w-full h-[520px] md:h-screen min-h-[520px] max-h-[900px] overflow-hidden bg-primary select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── background ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <SlideImage src={slide.img} accent={slide.accent} />
        </motion.div>
      </AnimatePresence>

      {/* ── film grain ── */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── content ── */}
      <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 lg:items-center lg:pb-0">
        <div className="app-container w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${index}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl"
            >
              {/* eyebrow */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-secondary text-xs font-black uppercase mb-3 md:mb-4 tracking-[0.35em]"
              >
                {slide.eyebrow}
              </motion.p>

              {/* headline */}
              <h1
                className="text-white font-black leading-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter mb-4 md:mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {slide.headline.map((line, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.12 }}
                    className="block"
                  >
                    {i === 1 ? (
                      <span className="text-secondary">{line}</span>
                    ) : (
                      line
                    )}
                  </motion.span>
                ))}
              </h1>

              {/* sub */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-white/65 text-sm md:text-base leading-relaxed mb-7 md:mb-9 max-w-md"
              >
                {slide.sub}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <Link
                  to={ctaPath}
                  className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-secondary text-white text-xs font-black tracking-widest uppercase hover:bg-secondary/90 hover:shadow-[0_8px_28px_rgba(5,150,105,0.4)] active:scale-95 transition-all duration-300"
                >
                  {slide.cta.label}
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/menu"
                  className="text-white/50 hover:text-white text-xs tracking-widest uppercase font-bold transition-colors duration-200"
                >
                  View Menu
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── bottom controls ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 md:pb-8">
        <div className="app-container flex items-center justify-between gap-6">
          {/* dot indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={[
                  "rounded-full transition-all duration-300",
                  i === index
                    ? "bg-secondary w-8 h-1.5"
                    : "bg-white/25 hover:bg-white/50 w-1.5 h-1.5",
                ].join(" ")}
              />
            ))}
          </div>

          {/* fraction */}
          <span className="text-white/35 text-xs font-black tracking-widest tabular-nums hidden sm:block">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>

          {/* arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-90"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-90"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* progress — h-0.5 instead of h-[2px] */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          {!paused && (
            <motion.div
              key={`prog-${index}`}
              className="h-full bg-secondary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: INTERVAL / 1000, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-xs tracking-[0.35em] uppercase font-bold [writing-mode:vertical-rl]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8 bg-linear-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Banner;
