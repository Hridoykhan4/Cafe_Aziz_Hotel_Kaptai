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
    <section className="bg-base-100 pb-20">
      {/* ── HERO SECTION ── */}
      <Cover
        img={menuImg}
        title="Our Menu"
        desc="Discover flavors crafted with passion"
      />

      {/* ── TODAY'S OFFER ── */}
      <div className="section-padding app-container">
        <SectionTitle
          subHeading="Don't miss"
          heading="Today's Offer"
          dark={false}
        />

        {categorizedMenu["offered"]?.length ? (
          <MenuCategory items={categorizedMenu["offered"]} />
        ) : (
          <p className="text-center text-base-content/40 py-10 font-light italic">
            No gourmet offers available today...
          </p>
        )}
      </div>

      {/* ── CATEGORY SECTIONS ── */}
      <div className="space-y-24">
        {categories.map(({ key, title, desc, coverImage }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <MenuCategory
              title={title}
              desc={desc}
              coverImage={coverImage}
              items={categorizedMenu[key] || []}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
