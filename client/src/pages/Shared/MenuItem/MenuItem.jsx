// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MenuItem = ({ item }) => {
  const { name, price, recipe, image } = item || {};

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <motion.img
        className="w-28 h-28 rounded-[40%] object-cover object-center shadow-md"
        src={image}
        alt={name}
        whileHover={{ rotate: 2 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Text Section */}
      <div className="sm:flex-1">
        <div className="flex items-center flex-wrap justify-between">
          <h2 className="uppercase font-semibold text-lg tracking-wide text-gray-800">
            {name}
          </h2>
        <span className="text-amber-600 font-bold text-lg">${price}</span>
        </div>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{recipe}</p>
      </div>
    </motion.div>
  );
};

export default MenuItem;
