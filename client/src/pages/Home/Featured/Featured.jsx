import { motion } from "framer-motion";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import featuredImg from "../../../assets/home/featured.jpg";
import { Link } from "react-router-dom";

const Featured = () => {
  return (
    <section className="relative w-full overflow-hidden bg-primary section-padding mb-10 md:mb-20">
      {/* 1. Cinematic Background - Using grayscale for sophisticated depth */}
      <div
        className="absolute inset-0 z-0 opacity-40 grayscale"
        style={{
          backgroundImage: `url(${featuredImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* 2. NEXT LEVEL MASKING: Deepens the left side for text, clears the right side for the image */}
      <div className="absolute inset-0 z-10 bg-linear-to-r from-primary via-primary/95 via-40% to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-primary/80 via-transparent to-primary/40" />

      <div className="relative z-20 app-container">
        {/* Force white text for SectionTitle here since it's on a dark bg */}
        <div className="mb-10 brightness-200 contrast-200">
          <SectionTitle
            heading="Chef's Special"
            subHeading="Featured Item"
            dark={true} 
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* ── IMAGE BOX ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 group"
          >
            <div className="relative overflow-hidden rounded-selector shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <img
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                src={featuredImg}
                alt="Featured Dish"
              />
              {/* Subtle Inner Glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* ── TEXT BOX ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-secondary" />
              <p className="text-secondary font-black text-xs uppercase tracking-[0.4em] drop-shadow-sm">
                March 05, 2026
              </p>
            </div>

            <h3 className="text-4xl md:text-6xl font-heading font-bold text-white leading-[1.1] tracking-tight">
              Discover The <br />
              <span className="text-secondary italic font-light drop-shadow-md">
                Bold Flavors
              </span>
            </h3>

            <div className="glass-card bg-white/3 p-6 rounded-selector border-white/5 backdrop-blur-sm">
              <p className="text-white/90 text-base md:text-lg leading-relaxed font-main italic">
                “Experience the taste of perfection — a rich fusion of spices,
                tender ingredients, and a smoky finish. Crafted by our master
                chefs, this dish is a statement of culinary art.”
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/order/salad"
                className="group relative inline-flex items-center gap-4 px-10 py-4 bg-transparent border-2 border-secondary text-secondary rounded-full font-bold uppercase tracking-widest text-[11px] overflow-hidden transition-all duration-500 hover:text-white"
              >
                <span className="absolute inset-0 w-0 h-full bg-secondary transition-all duration-500 ease-out group-hover:w-full -z-10" />
                <span className="relative z-10">Order This Special</span>
                <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Featured;