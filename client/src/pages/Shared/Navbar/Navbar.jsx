import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import Swal from "sweetalert2";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";

const Navbar = () => {
  const { user, logOut } = useAuthValue();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const navLinkBase =
    "px-4 py-2 font-semibold transition duration-300 rounded-md";
  const navLinkActive = "text-green-400 font-bold border-b-2 border-green-400";
  const navLinkDefault = "text-white hover:text-green-400";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "Do you really want to log out?",
      icon: "question",
      background: "#f0f9ff",
      color: "#0f172a",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Stay logged in",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      },
    });

    if (result.isConfirmed) {
      try {
        await logOut();
        Swal.fire({
          title: "Logged out!",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: `${err?.message || "OOpps"}`,
          text: "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  const navOptions = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
          }
        >
          Contact
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
          }
        >
          Our Menu
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/order/salad"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
          }
        >
          Order Food
        </NavLink>
      </li>

      {user && isAdmin ? (
        <li className="flex">
          <NavLink
            to="/dashboard/adminHome"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
            }
          >
            {/* <FaHome /> */}
            Dashboard
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink
            to="/dashboard/cart"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
            }
          >
            <div className="relative flex items-center gap-2">
              <FaShoppingCart className="text-lg" />
              <div className="badge badge-secondary text-xs">
                +{cart?.length}
              </div>

              {cart?.length > 0 && (
                <span className="absolute -right-2 -top-2 h-2 w-2 bg-green-400 rounded-full animate-ping"></span>
              )}
            </div>
          </NavLink>
        </li>
      )}

      {user ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 object-cover h-10 rounded-full">
              <img
                alt="Profile Pic"
                referrerPolicy="no-referrer"
                src={
                  user?.photoURL ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                {user?.displayName || "Guest"}
                <span className="badge">Active</span>
              </a>
            </li>
            <li>
              <a className="justify-between">
                {user?.email || "Guest"}
                <span className="badge"></span>
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition font-medium"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? navLinkActive : navLinkDefault}`
          }
        >
          Login
        </NavLink>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="navbar fixed z-50 bg-black/40 backdrop-blur-xl shadow-lg px-4"
    >
      {/* Logo */}
      <div className="navbar-start">
        <Link to="/" className="leading-tight">
          <span
            style={{ boxShadow: "5px 13px 15px 1px #000000" }}
            className="font-extrabold text-xl text-green-300"
          >
            Cafe Aziz
          </span>
          <br />
          <span className="tracking-widest text-gray-200 text-sm">
            Hotel & Restaurant
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center ms-auto  hidden lg:flex">
        <ul className="flex items-center gap-4">{navOptions}</ul>
      </div>

      {/* Mobile Menu */}
      <div className="navbar-end lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-outline text-white"
        >
          ☰
        </button>

        {open && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute w-52 flex flex-col right-4 top-16 bg-gray-800 p-4 rounded-lg shadow-xl space-y-3"
          >
            {navOptions}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
