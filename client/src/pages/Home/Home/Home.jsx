import { Helmet } from "react-helmet-async";
import Banner from "../Banner/Banner";
import Category from "../Category/Category";
import Featured from "../Featured/Featured";
import OurRecommends from "../OurRecommends/OurRecommends";
import OurSlogan from "../OurSlogan/OurSlogan";
import PopularMenu from "../PopularMenu/PopularMenu";
import Testimonials from "../Testimonials/Testimonials";
import useScrollTo from "../../../hooks/useScrollTo";

const Home = () => {
  useScrollTo();
  return (
    <section>
      <Helmet>
        <title>Cafe Aziz | Home</title>
        <meta
          name="description"
          content="The finest dining experience in Kaptai."
        />
      </Helmet>
      <Banner></Banner>
      {/* <Category></Category>
      <OurSlogan></OurSlogan>
      <PopularMenu></PopularMenu>
      <OurRecommends></OurRecommends>
      <Featured></Featured>
      <Testimonials></Testimonials> */}
    </section>
  );
};

export default Home;
