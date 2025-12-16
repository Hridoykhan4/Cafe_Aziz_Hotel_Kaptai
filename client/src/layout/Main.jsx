import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaAirbnb } from "react-icons/fa";

const Main = () => {
  const navigation = useNavigation();

  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>

      <main className="min-h-[calc(100vh-230px)]">
        {navigation.state === "loading" ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Outlet></Outlet>
        )}
      </main>

      <button
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="fixed z-[1000] bottom-10 right-4 w-12 h-12 flex justify-center btn items-center rounded-full bg-amber-600"
      >
        <FaAirbnb className="text-white  font-semibold animate-bounce"></FaAirbnb>
      </button>

      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
};

export default Main;
