import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import item1 from "../../../assets/shop/biriyani.png";
import item2 from "../../../assets/shop/food2.jpg";
import item3 from "../../../assets/shop/food3.jpg";

const OurRecommends = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-20 mt-6">
      <SectionTitle heading="Chef Recommends" subHeading="--- Must Try Dishes ---" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { 
            img: item1, 
            title: "Royal Biriyani", 
            desc: "Aromatic basmati rice layered with tender meat, infused with saffron and rich spices for a royal taste." 
          },
          { 
            img: item2, 
            title: "Grilled Toast Chicken", 
            desc: "Juicy chicken grilled to perfection, served with crispy toast and a hint of garlic butter." 
          },
          { 
            img: item3, 
            title: "Crispy Vegetable Roll", 
            desc: "Golden-fried rolls packed with fresh veggies and herbs, served with tangy chutney." 
          },
        ].map((item, i) => (
          <div 
            key={i} 
            className="card bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
          >
            {/* Image */}
            <figure className="px-6 pt-6">
              <img 
                src={item?.img} 
                alt={item?.title} 
                className="rounded-xl w-full h-48 object-cover" 
              />
            </figure>

            {/* Content */}
            <div className="card-body items-center text-center">
              <h2 className="card-title text-gray-800 text-lg font-semibold">
                {item?.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item?.desc}
              </p>
              {/* <div className="card-actions mt-4">
                <button className="btn bg-amber-500 hover:bg-amber-600 text-white border-0 rounded-full px-6 py-2 transition-transform hover:scale-105">
                  Add To Cart
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurRecommends;
