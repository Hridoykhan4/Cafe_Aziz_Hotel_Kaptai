import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import img1 from "../../../assets/home/01.jpg";
import img2 from "../../../assets/home/02.jpg";
import img3 from "../../../assets/home/03.png";
import img4 from "../../../assets/home/04.jpg";
import img5 from "../../../assets/home/05.png";
import img6 from "../../../assets/home/06.png";

const Banner = () => {
  const images = [img1, img2, img3, img4, img5, img6];

  return (
    <section className="w-full rounded-2xl  overflow-hidden shadow-2xl">
      <Carousel
        autoPlay
        infiniteLoop
        interval={5000}
        swipeable
        emulateTouch
        transitionTime={800}
        stopOnHover={false}
        showArrows={true}
        className="banner-carousel"
      >
        {images.map((src, index) => (
          <div key={index} className="relative group h-[450px]  md:h-screen">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-102"
            />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Banner;
