/* eslint-disable no-unused-vars */
import {
  FaBook,
  FaCalendar,
  FaFirstOrder,
  FaHome,
  FaList,
  FaPaypal,
  FaShoppingCart,
  FaStarAndCrescent,
  FaUser,
  FaUtensils,
} from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { FcContacts } from "react-icons/fc";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";

const Dashboard = () => {
  const { cart } = useCart();
  const { isAdmin, isAdminLoading } = useAdmin();
  const { user } = useAuthValue();
  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300";
  const linkActive = "bg-green-100 text-green-700 font-semibold shadow-sm";
  const linkDefault = "text-gray-600 hover:bg-gray-100 hover:text-green-600";

  const Section = ({ title }) => (
    <p className="mt-6 mb-2 px-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
      {title}
    </p>
  );

  const NavItem = ({ to, icon: Icon, label, extra }) => (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkDefault}`
        }
      >
        <Icon className="text-lg" />
        <span className="flex-1">{label}</span>
        {extra}
      </NavLink>
    </li>
  );

  if (isAdminLoading) return <LoadingSpinner />;

  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* TOP BAR */}
        <div className="navbar bg-white border-b px-4 lg:px-8">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-square"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 text-xl font-bold text-gray-800">
            {user?.displayName || 'Guest'} ({isAdmin ? "Admin" : "User"}) 
          </div>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-9 rounded-full ring ring-green-400 ring-offset-2">
                <img
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  src={user?.photoURL || "https://i.pravatar.cc/100"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeInOut' }}
          className="p-4 lg:p-8"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />

        <aside className="w-72 bg-white min-h-full border-r shadow-xl">
          {/* BRAND */}
          <div className="px-6 py-6 border-b">
            <h2 className="text-2xl font-extrabold text-green-600">Cafe Aziz</h2>
            <p className="text-xs text-gray-400">Hotel & Restaurant</p>
          </div>

          {/* MENU */}
          <ul className="menu px-3 py-4 text-sm">
            {isAdmin ? (
              <>
                <Section title="Admin" />
                <NavItem
                  to="/dashboard/adminHome"
                  icon={FaHome}
                  label="Admin Home"
                />
                <NavItem
                  to="/dashboard/addItems"
                  icon={FaUtensils}
                  label="Add Items"
                />
                <NavItem
                  to="/dashboard/manageItems"
                  icon={FaList}
                  label="Manage Items"
                />
                <NavItem
                  to="/dashboard/manageBooking"
                  icon={FaBook}
                  label="Manage Bookings"
                />
                <NavItem
                  to="/dashboard/allUsers"
                  icon={FaUser}
                  label="All Users"
                />
              </>
            ) : (
              <>
                <Section title="User" />
                <NavItem
                  to="/dashboard/userHome"
                  icon={FaHome}
                  label="User Home"
                />
                <NavItem
                  to="/dashboard/cart"
                  icon={FaShoppingCart}
                  label="My Cart"
                  extra={
                    <span className="badge badge-success badge-sm text-white">
                      {cart?.length || 0}
                    </span>
                  }
                />
                <NavItem
                  to="/dashboard/reservation"
                  icon={FaCalendar}
                  label="Reservation"
                />
                <NavItem
                  to="/dashboard/payment_history"
                  icon={FaPaypal}
                  label="Payment History"
                />
                <NavItem
                  to="/dashboard/review"
                  icon={FaStarAndCrescent}
                  label="Add Review"
                />
                <NavItem
                  to="/dashboard/bookings"
                  icon={TbBrandBooking}
                  label="My Bookings"
                />
              </>
            )}

            <Section title="Public" />
            <NavItem to="/" icon={FaHome} label="Home" />
            <NavItem to="/order/salad" icon={MdRestaurantMenu} label="Menu" />
            <NavItem to="/contact" icon={FcContacts} label="Contact" />
            {!isAdmin && (
              <NavItem
                to="/order/salad"
                icon={FaFirstOrder}
                label="Order Now"
              />
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
