import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
   FIXES:
   [1] Removed initial={{ scale: 1.1 }} on the image wrapper.
       Scale transforms on mount trigger a layout+paint cycle which
       contributed to the blink seen on the Order page post-deploy.
       The fade-in alone is sufficient and doesn't cause reflow.

   [2] Added will-change: transform on the img so the browser composites
       it on the GPU before it's needed — no jank on first paint.

   [3] Added loading="eager" + fetchpriority="high" on the img so the
       cover image is prioritized in the network queue (especially important
       on the Order page which is lazy-loaded).
───────────────────────────────────────────────────────────────────── */

const Cover = ({ img, title, desc, height = "600px" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden mb-12"
      style={{ height }}
    >
      {/* Image layer — no scale transform on mount */}
      <div className="absolute inset-0 z-0">
        <img
          src={img}
          alt={title}
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ willChange: "transform" }}
        />
        {/* Cinematic gradient mask */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/60 via-primary/20 to-primary/70" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card bg-primary/30 border-white/10 backdrop-blur-md p-10 md:p-20 rounded-selector max-w-4xl"
        >
          <h1 className="text-white font-heading text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-4 drop-shadow-2xl">
            {title}
            <span className="text-secondary">.</span>
          </h1>

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-secondary" />
            <p className="text-white/90 font-main text-sm md:text-lg uppercase tracking-[0.4em] font-light italic">
              {desc}
            </p>
            <span className="h-px w-8 bg-secondary" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cover;
