import { motion } from "framer-motion";

const MenuItem = ({ item, index }) => {
  const { name, price, recipe, image } = item || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-row items-start gap-4 p-2 transition-colors"
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative shrink-0">
        <motion.img
          src={image}
          alt={name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
        />
        {/* Animated Accent Border */}
        <div className="absolute inset-0 border border-secondary/0 group-hover:border-secondary/30 rounded-2xl transition-all duration-500 scale-110 group-hover:scale-100" />
      </div>

      {/* ── TEXT SECTION ── */}
      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 uppercase tracking-tight">
            {name}
          </h3>

          {/* THE LUXURY CONNECTOR */}
          <div className="menu-connector hidden sm:block group-hover:border-secondary/30 transition-colors" />

          <span className="font-main font-bold text-secondary text-lg">
            ${price}
          </span>
        </div>

        <p className="text-base-content/60 text-sm mt-1 leading-snug font-main italic max-w-md">
          {recipe}
        </p>

        {/* Hover Highlight Line */}
        <motion.div className="h-1px bg-secondary/20 w-0 group-hover:w-full transition-all duration-700 mt-2" />
      </div>
    </motion.div>
  );
};

export default MenuItem;
