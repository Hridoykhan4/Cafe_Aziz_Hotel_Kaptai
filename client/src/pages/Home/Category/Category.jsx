import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

// Assets
import slide1 from "../../../assets/home/slide1.jpg";
import slide2 from "../../../assets/home/slide2.jpg";
import slide3 from "../../../assets/home/slide3.jpg";
import slide4 from "../../../assets/home/slide4.jpg";
import slide5 from "../../../assets/home/slide5.jpg";

const categories = [
  { img: slide1, title: "Salads", count: "12 Items" },
  { img: slide2, title: "Soups", count: "08 Items" },
  { img: slide3, title: "Pizzas", count: "15 Items" },
  { img: slide4, title: "Desserts", count: "10 Items" },
  { img: slide5, title: "Beverages", count: "20 Items" },
];

const Category = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef();

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  return (
    <section className="section-padding overflow-hidden bg-base-100">
      {/* Title with staggered reveal */}
      <SectionTitle
        heading="Order Online"
        subHeading="From 11:00am to 10:00pm"
      />

      <motion.div
        ref={carousel}
        className="cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-8 px-4"
        >
          {categories.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="min-w-75 md:min-w-87.5 h-125 relative group rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Image with Parallax Scale */}
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

              {/* The "Shine" Animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-linear-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform skew-x-12" />

              {/* Content Box */}
              <div className="absolute inset-x-6 bottom-8">
                <div className="glass-card p-8 rounded-3xl text-center backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-secondary text-[11px] font-black uppercase tracking-[0.4em] mb-2 opacity-80">
                    {item.count}
                  </p>
                  <h3 className="text-white text-3xl font-bold tracking-tight font-heading mb-4">
                    {item.title}
                  </h3>

                  {/* Action Link */}
                  <motion.div className="flex justify-center items-center gap-2 text-white/60 group-hover:text-secondary transition-colors duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Explore Category
                    </span>
                    <div className="w-8 h-1px bg-current transition-all duration-300 group-hover:w-12" />
                  </motion.div>
                </div>
              </div>

              {/* Category Number Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white/40 font-black text-xs group-hover:border-secondary group-hover:text-secondary transition-colors duration-500">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Modern Interaction Hint */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {categories.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 bg-secondary rounded-full"
              initial={false}
              animate={{
                width: i === 0 ? 32 : 8,
                opacity: i === 0 ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-primary/30 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
          Drag to explore
        </p>
      </div>
    </section>
  );
};

export default Category;
