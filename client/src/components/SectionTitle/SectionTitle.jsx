import { motion } from "framer-motion";

const SectionTitle = ({ heading, subHeading, dark = false }) => {
  const cleanSubHeading = subHeading?.replace(/-/g, "");

  // Dynamic colors based on the 'dark' prop
  const textColor = dark ? "text-white" : "text-primary";
  const ghostTextColor = dark ? "text-white/[0.05]" : "text-primary/[0.03]";

  return (
    <div className="relative mb-12 md:mb-20 text-center max-w-2xl mx-auto px-4">
      {/* 1. The Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3 mb-3"
      >
        <span className="h-px w-8 bg-secondary/40 hidden sm:block"></span>
        <p className="text-secondary text-xs md:text-sm font-black uppercase tracking-[0.4em]">
          {cleanSubHeading}
        </p>
        <span className="h-px w-8 bg-secondary/40 hidden sm:block"></span>
      </motion.div>

      {/* 2. The Main Heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <h2
          className={`${textColor} font-heading text-4xl md:text-6xl font-bold tracking-tighter leading-tight relative inline-block transition-colors duration-500`}
        >
          {heading}
          <span className="text-secondary ml-1 inline-block animate-pulse">
            .
          </span>
        </h2>
      </motion.div>

      {/* 3. The Modern Underline Accent */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "80px", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
        className="mt-6 h-1.5 bg-linear-to-r from-secondary to-emerald-200 mx-auto rounded-full"
      />

      {/* 4. Background Ghost Text */}
      <span
        className={`absolute -top-6 left-1/2 -translate-x-1/2 text-7xl md:text-9xl font-black ${ghostTextColor} select-none pointer-events-none -z-10 uppercase tracking-tighter transition-colors`}
      >
        {heading.split(" ")[0]}
      </span>
    </div>
  );
};

export default SectionTitle;
