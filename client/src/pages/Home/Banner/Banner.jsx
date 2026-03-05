import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../../../assets/home/banner.jpg";
import img2 from "../../../assets/home/pexels-change-c-c-974768353-30700761.jpg";
import img3 from "../../../assets/home/pexels-harry-dona-2338407.jpg";
import img4 from "../../../assets/home/featured.jpg";
import img5 from "../../../assets/home/pexels-sylwester-ficek-154797634-20321627.jpg";

const images = [img1, img2, img3, img4, img5];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[450px] md:h-screen overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-3xl px-6"
        >
          <h1 className="text-white text-3xl md:text-6xl font-bold leading-tight uppercase tracking-tighter">
            শান্ত পরিবেশে <br />
            <span className="text-secondary">বিশ্বাসযোগ্য সেবা</span>
          </h1>
          <p className="mt-4 text-gray-200 text-lg">
            আপনার আরাম, আমাদের দায়িত্ব
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
