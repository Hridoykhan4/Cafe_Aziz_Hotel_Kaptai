
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Cover from "../../Shared/Cover/Cover";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import MenuCategory from "../MenuCategory/MenuCategory";
import useMenu from "../../../hooks/useMenu";

import menuImg from "../../../assets/menu/banner3.jpg";
import dessertBg from "../../../assets/menu/dessert-bg.jpeg";
import soupBg from "../../../assets/menu/soup-bg.jpg";
import saladBg from "../../../assets/menu/salad-bg.jpg";
import pizzaBg from "../../../assets/menu/pizza-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Menu = () => {
  
  const { menu } = useMenu();

  const categories = [
    {
      key: "dessert",
      title: "Desserts",
      desc: "Sweet delights to end your meal with a smile",
      coverImage: dessertBg,
    },
    {
      key: "soup",
      title: "Soups",
      desc: "Warm, comforting, and full of flavor",
      coverImage: soupBg,
    },
    {
      key: "salad",
      title: "Salads",
      desc: "Fresh, healthy, and crunchy bites",
      coverImage: saladBg,
    },
    {
      key: "pizza",
      title: "Pizzas",
      desc: "Cheesy, crispy, and baked to perfection",
      coverImage: pizzaBg,
    },
  ];

  const categorizedMenu =
    menu?.reduce((acc, item) => {
      const cat = item?.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {}) || {};

  return (
    <section className="bg-base-100">
    
      {/* HERO */}
      <Cover
        img={menuImg}
        title="Our Menu"
        desc="Discover flavors crafted with passion"
      />

      {/* TODAY'S OFFER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <SectionTitle
          subHeading="---Don't miss---"
          heading="🔥 Today's Offer"
        />

        {categorizedMenu["offered"]?.length ? (
          <MenuCategory items={categorizedMenu["offered"]} />
        ) : (
          <p className="text-center text-gray-400 py-10">
            No offers available today
          </p>
        )}
      </motion.div>

      {/* CATEGORY SECTIONS */}
      {categories.map(({ key, title, desc, coverImage }) => (
        <motion.div
          key={key}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MenuCategory
            title={title}
            desc={desc}
            coverImage={coverImage}
            items={categorizedMenu[key] || []}
          />
        </motion.div>
      ))}
    </section>
  );
};

export default Menu;
