import Banner from "../Banner/Banner";
import { lazy, Suspense } from "react";
const Category = lazy(() => import('../Category/Category'))
// import Category from "../Category/Category";
// import Featured from "../Featured/Featured";
// import OurRecommends from "../OurRecommends/OurRecommends";
// import OurSlogan from "../OurSlogan/OurSlogan";
// import PopularMenu from "../PopularMenu/PopularMenu";
// import Testimonials from "../Testimonials/Testimonials";
import useScrollTo from "../../../hooks/useScrollTo";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Home = () => {
  useScrollTo();
  return (
    <section className="fade-in overflow-hidden">
      <Banner></Banner>
      <div className="app-container">
          <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
      <Category></Category>

          </Suspense>
      </div>
      {/* <OurSlogan></OurSlogan>
      <PopularMenu></PopularMenu>
      <OurRecommends></OurRecommends>
      <Featured></Featured>
      <Testimonials></Testimonials> */}
    </section>
  );
};

export default Home;
