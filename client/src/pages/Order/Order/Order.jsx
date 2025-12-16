import { Helmet } from "react-helmet-async";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import Cover from "../../Shared/Cover/Cover";
import useMenu from "../../../hooks/useMenu";
import FoodCard from "../../../components/FoodCard/FoodCard";

import orderCover from "../../../assets/shop/order.jpg";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = ["salad", "pizza", "soup", "dessert", "drinks"];

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Order = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { menu } = useMenu();

  /* Active tab from URL */
  const initialTab = categories.indexOf(category);
  const [tabIndex, setTabIndex] = useState(initialTab >= 0 ? initialTab : 0);

  useEffect(() => {
    const idx = categories.indexOf(category);
    if (idx !== -1) setTabIndex(idx);
  }, [category]);

  /* Group menu by category */
  const categorizedMenu = useMemo(() => {
    const grouped = Object.fromEntries(categories.map((c) => [c, []]));
    menu.forEach((item) => {
      if (grouped[item.category]) grouped[item.category].push(item);
    });
    return grouped;
  }, [menu]);

  /* Sync tab + URL */
  const handleTabSelect = (index) => {
    setTabIndex(index);
    navigate(`/order/${categories[index]}`);
  };


  return (
    <section className="bg-base-100">
      <Helmet>
        <title>Cafe Aziz | Order</title>
      </Helmet>

      {/* HERO */}
      <Cover
        img={orderCover}
        title="Order Your Favorite Food"
        desc="Freshly prepared, fast delivered, unforgettable taste"
      />

      {/* INTRO */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center px-6 mt-14"
      >
        <h2 className="text-4xl font-extrabold tracking-tight mb-4">
          🍽 Pick a Category & Order
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          From healthy salads to cheesy pizzas — everything is crafted with
          quality ingredients and love.
        </p>
      </motion.div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 my-14">
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList className="flex flex-wrap justify-center gap-4 border-b pb-5">
            {categories.map((c) => (
              <Tab
                key={c}
                className="px-6 py-2 rounded-full cursor-pointer capitalize font-semibold
                           text-gray-600 border border-gray-200
                           hover:bg-green-50 hover:text-green-600
                           transition-all duration-300"
                selectedClassName="bg-green-600 text-white border-green-600 shadow-md"
              >
                {c}
              </Tab>
            ))}
          </TabList>

          {/* PANELS */}
          {categories.map((c) => {
            const items = categorizedMenu[c];
            const slides = chunkArray(items, 6);

            return (
              <TabPanel key={c}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {items.length === 0 ? (
                    <p className="text-center text-gray-400 italic mt-10">
                      No items available in this category
                    </p>
                  ) : (
                    <Swiper
                      modules={[Pagination, Autoplay, Navigation]}
                      navigation
                      pagination={{ clickable: true }}
                      // autoplay={autoplay}
                      spaceBetween={30}
                      className="mt-12"
                    >
                      {slides.map((group, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {group.map((item) => (
                              <FoodCard key={item._id} item={item} />
                            ))}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </motion.div>
              </TabPanel>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default Order;
