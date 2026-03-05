import { motion } from "framer-motion";
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
    // Calculates how far we can scroll
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  return (
    <section className="app-container section-padding overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionTitle
          heading="Order Online"
          subHeading="--- From 11:00am to 10:00pm ---"
        />
      </motion.div>

      {/* Main Carousel Wrapper */}
      <motion.div
        ref={carousel}
        className="cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6"
        >
          {categories.map((item, i) => (
            <motion.div
              key={i}
              className="min-w-[280px] md:min-w-[320px] h-[450px] relative group rounded-3xl overflow-hidden shadow-2xl bg-primary"
            >
              {/* Background Image */}
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
              />

              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Floating Content Card (Glassmorphism) */}
              <div className="absolute inset-x-4 bottom-6 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <div className="glass-card p-6 rounded-2xl text-center backdrop-blur-lg bg-white/10 border border-white/20">
                  <p className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                    {item.count}
                  </p>
                  <h3 className="text-white text-2xl font-bold tracking-tight font-heading">
                    {item.title}
                  </h3>

                  <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-500">
                    <button className="mt-2 text-white/80 text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors">
                      Browse Menu +
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator Hint */}
      <div className="mt-8 flex justify-center gap-2">
        <div className="w-12 h-1 bg-secondary rounded-full opacity-20" />
        <div className="w-4 h-1 bg-secondary rounded-full" />
        <div className="w-12 h-1 bg-secondary rounded-full opacity-20" />
      </div>
    </section>
  );
};

export default Category;
