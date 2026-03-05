import Banner from "../Banner/Banner";
import { lazy, Suspense } from "react";
const Category = lazy(() => import("../Category/Category"));
const OurSlogan = lazy(() => import("../OurSlogan/OurSlogan"));
const PopularMenu = lazy(() => import("../PopularMenu/PopularMenu"));
const Featured = lazy(() => import("../Featured/Featured"));
const Testimonials = lazy(() => import("../Testimonials/Testimonials"));
import useScrollTo from "../../../hooks/useScrollTo";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Home = () => {
  useScrollTo();
  return (
    <section className="fade-in relative overflow-hidden">
      <Banner></Banner>
      <div className="app-container">
        <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
          <Category></Category>
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <OurSlogan />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <PopularMenu />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Featured />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials />
        </Suspense>
      </div>
    </section>
  );
};

export default Home;
