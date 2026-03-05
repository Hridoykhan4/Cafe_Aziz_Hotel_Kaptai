import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic(`/reviews`).then(({ data }) => setReviews(data));
  }, [axiosPublic]);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (!reviews.length) return null;

  const { name, details, rating } = reviews[index];

  return (
    <section className="section-padding bg-base-100 overflow-hidden">
      <div className="app-container">
        <SectionTitle
          heading="Testimonials"
          subHeading="Voices of Our Guests"
        />
        {/* Reduced margin-top (mt-6 instead of mt-10) to pull content closer to Title */}
        <div className="relative max-w-4xl mx-auto ">
          {/* Main Review Card - REMOVED min-h-112.5 */}
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                // Using your glass-card and rounded-selector
                className="glass-card p-8 md:p-12 rounded-selector text-center w-full shadow-xl shadow-primary/5 border-base-200"
              >
                {/* 1. Emerald Star Rating - More compact mb-4 */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < rating ? "text-secondary" : "text-base-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* 2. Quotation - Absolute positioned to save vertical space */}
                <span className="text-secondary opacity-10 text-9xl font-serif absolute top-4 left-6 select-none">
                  “
                </span>

                {/* 3. Review Text - Reduced font size for better balance */}
                <p className="relative z-10 text-primary/80 text-lg md:text-2xl font-main font-light italic leading-relaxed mb-8 px-2 md:px-10">
                  {details}
                </p>

                {/* 4. Reviewer Meta - Compact Layout */}
                <div className="flex flex-col items-center">
                  <div className="h-0.5 w-8 bg-secondary/30 rounded-full mb-3" />
                  <h4 className="text-primary font-heading text-xl font-bold uppercase tracking-widest">
                    {name}
                  </h4>
                  <p className="text-secondary font-black text-[9px] uppercase tracking-[0.3em] mt-2 opacity-80">
                    Verified Guest
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 5. Luxury Controls - Pulled up with negative margin to sit closer to card */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevStep}
              className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group active:scale-95"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
            </button>
            <button
              onClick={nextStep}
              className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30 hover:scale-105 transition-all duration-300 group active:scale-95"
            >
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
