import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import chefService from "../../../assets/home/chef-service.jpg";

const OurSlogan = () => {
  const containerRef = useRef(null);

  // Parallax effect for the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative section-padding w-full min-h-125 md:min-h-150 flex items-center justify-center overflow-hidden mb-20"
    >
      {/* 1. Parallax Background Image */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-primary/80 via-primary/40 to-primary/80 z-10" />
        <img
          src={chefService}
          alt="Chef Service"
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      {/* 2. Floating Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-[90%] max-w-5xl"
      >
        <div className="glass-card py-16 md:py-24 px-8 md:px-20 rounded-[3rem] text-center backdrop-blur-md bg-white/3 border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]">
          {/* Decorative Top Icon/Line */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <div className="w-12 h-px bg-secondary/50 self-center" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
            Cafe Aziz <span className="text-secondary">Hotel</span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg md:text-2xl font-light leading-relaxed text-white/80 italic font-main">
            “Where Every Bite Tells a Story — Crafted with Passion, Served with
            Love.”
          </p>

          {/* Elegant Accent Button (Optional but adds 'Next Level' feel) */}
          <motion.div
            className="mt-12 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="px-8 py-3 rounded-full border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-[0.3em] hover:bg-secondary hover:text-white transition-all duration-500 bg-secondary/5">
              Our Legacy
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Decorative Corner Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border-l border-t border-white/10 rounded-tl-3xl hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border-r border-b border-white/10 rounded-br-3xl hidden lg:block" />
    </section>
  );
};

export default OurSlogan;
