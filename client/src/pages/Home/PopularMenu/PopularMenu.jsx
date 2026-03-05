import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import MenuItem from "../../Shared/MenuItem/MenuItem";
import useMenu from "../../../hooks/useMenu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PopularMenu = () => {
  const { menu, loading } = useMenu();
  const popular = menu.filter((m) => m.category === "popular");

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );

  return (
    <section className="section-padding bg-base-100 relative">
      <SectionTitle
        heading="From Our Menu"
        subHeading="Our Chef's Popular Picks"
      />

      {/* Grid with specialized gap for readability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {popular?.map((item, index) => (
          <MenuItem item={item} key={item._id} index={index} />
        ))}
      </div>

      {/* ── PREMIUM VIEW FULL MENU BUTTON ── */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Link
          to="/menu"
          className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-primary rounded-full hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/30"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-widest text-xs uppercase">
            View Full Menu
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default PopularMenu;
