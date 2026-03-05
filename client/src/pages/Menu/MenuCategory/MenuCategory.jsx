import { Link } from "react-router-dom";
import Cover from "../../Shared/Cover/Cover";
import MenuItem from "../../Shared/MenuItem/MenuItem";

const MenuCategory = ({ items, title, desc, coverImage }) => {
  return (
    <div className="w-full">
      {/* 1. Header Cover (Optional) */}
      {title && (
        <div className="mb-16">
          <Cover img={coverImage} title={title} desc={desc} />
        </div>
      )}

      {/* 2. Menu Grid - Strictly using your app-container */}
      <div className="app-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 lg:gap-x-20">
          {items?.map((item) => (
            <MenuItem item={item} key={item._id} />
          ))}
        </div>

        {/* 3. Next-Level CTA Button */}
        {title && (
          <div className="mt-16 mb-24 text-center">
            <Link
              to={`/order/${title.toLowerCase()}`}
              className="group relative inline-flex items-center gap-4 px-10 py-4 bg-transparent border-2 border-secondary text-secondary rounded-full font-bold uppercase tracking-widest text-[11px] overflow-hidden transition-all duration-500 hover:scale-103 hover:text-white "
            >
              {/* Animated Background Fill */}
              <span className="absolute inset-0 w-0 h-full bg-secondary transition-all duration-500 ease-out group-hover:w-full -z-10" />

              <span className="relative z-10">Explore {title}</span>

              <span className="relative z-10 ml-2 group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCategory;
