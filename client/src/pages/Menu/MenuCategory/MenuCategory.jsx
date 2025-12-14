import { Link } from "react-router-dom";
import Cover from "../../Shared/Cover/Cover";
import MenuItem from "../../Shared/MenuItem/MenuItem";

const MenuCategory = ({ items, title, desc, coverImage }) => {
  return (
    <div>
      {title && <Cover img={coverImage} title={title} desc={desc}></Cover>}

      <div className="grid w-11/12 mb-4 sm:grid-cols-2 gap-8 my-4 max-w-7xl mx-auto px-4 sm:px-0">
        {items?.map((item) => (
          <MenuItem item={item} key={item._id}></MenuItem>
        ))}
      </div>

      {title && (
        <div className="mb-7 mt-8 text-center">
          <Link
            to={`/order/${title.toLowerCase()}`}
            className="
          z-0
          bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 
          hover:from-amber-700 hover:via-amber-600 hover:to-amber-700
          border-0 text-white px-8 py-3 rounded-full 
          font-bold uppercase tracking-wider 
          shadow-lg hover:shadow-amber-400/40 
          transition-all duration-300 hover:scale-105
          focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50
        "
          >
            Order Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
