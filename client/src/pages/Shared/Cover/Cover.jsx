import { motion } from "framer-motion";

const Cover = ({ img, title, desc, height = "600px" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full overflow-hidden mb-12"
      style={{ height }}
    >
      {/* 1. The Image Layer with Scale Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img src={img} alt={title} className="w-full h-full object-cover" />
        {/* Cinematic Gradient Mask */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/60 via-primary/20 to-primary/70" />
      </motion.div>

      {/* 2. Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          // Using your glass-card but making it more transparent for the banner
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
