import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import img1 from "../../../assets/home/banner.jpg";
import img2 from "../../../assets/home/pexels-change-c-c-974768353-30700761.jpg";
import img3 from "../../../assets/home/pexels-harry-dona-2338407.jpg";
import img4 from "../../../assets/home/featured.jpg";
import img5 from "../../../assets/home/pexels-sylwester-ficek-154797634-20321627.jpg";

const Banner = () => {
  const images = [img1, img2, img3, img4, img5];

  return (
    <section className="w-full overflow-hidden rounded-2xl shadow-2xl">
      <Carousel
        autoPlay
        infiniteLoop
        interval={5000}
        transitionTime={900}
        swipeable
        emulateTouch
        stopOnHover={false}
        showThumbs={false}
        showStatus={false}
        showArrows
      >
        {images.map((src, index) => (
          <div key={index} className="relative h-[420px] md:h-screen">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/60"></div>

            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-3xl">
                <h1 className="text-white text-2xl md:text-5xl font-semibold tracking-wide leading-tight">
                  শান্ত পরিবেশে
                  <br />
                  <span className="text-emerald-300">বিশ্বাসযোগ্য সেবা</span>
                </h1>
                <p className="mt-4 text-gray-200 text-sm md:text-lg">
                  আপনার আরাম, আমাদের দায়িত্ব
                </p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Banner;
