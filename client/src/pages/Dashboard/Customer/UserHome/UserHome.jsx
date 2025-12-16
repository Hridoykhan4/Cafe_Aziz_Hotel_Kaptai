import { Helmet } from "react-helmet-async";
import useAuthValue from "../../../../hooks/useAuthValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import {
  FaBook,
  FaCartPlus,
  FaCashRegister,
  FaMoneyBill,
  FaStar,
  FaUtensils,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const UserHome = () => {
  const { user, loading } = useAuthValue();
  const axiosSecure = useAxiosSecure();

  const { data: userStats = {}, isPending } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/user-stats?email=${user?.email}`);
      return data;
    },
    enabled: !!user || !loading,
  });

  if (isPending) return <LoadingSpinner />;

  return (
    <div>
      <Helmet>
        <title>Bistro | User Dashboard</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome back, {user?.displayName || "Admin"} 👋
          </h1>
          <div
            className={`relative mt-4 overflow-hidden rounded-2xl p-6 shadow-xl text-white  z-0 bg-gradient-to-br from-pink-500 to-rose-600 `}
          >
            <div className="absolute -top-6 -right-6 opacity-20">
              <FaUtensils size={100} />
            </div>

            <div className="relative z-10">
              <p className="text-sm uppercase tracking-wider opacity-90">
                Total Menu Items
              </p>
              <h2 className="text-3xl font-extrabold mt-2">
                {userStats?.menuItems}
              </h2>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="my-4 flex flex-col md:flex-row ">
        <div className="md:flex-1  px-10 gap-4 py-10 rounded-md bg-pink-200/80 flex justify-center flex-col items-center">
          <img
            src={user?.photoURL}
            className="w-40 h-40 rounded-full object-cover"
            alt="user"
          />
          <h2 className="text-lg font-medium">
            {user?.displayName || "Guest"}
          </h2>
        </div>

        <div className="flex-1 p-10 bg-[#FEF9C3]/80 rounded-md">
          <h2 className="uppercase font-semibold text-lg">Your activities</h2>
          <div className="space-y-2 mt-4">
            <p className="text-pink-600 flex gap-1 items-center">
              <FaCartPlus></FaCartPlus>
              ORDERS: {userStats?.totalOrders || 0}
            </p>
            <p className="text-sky-600 flex gap-1 items-center">
              <FaStar></FaStar>
              REVIEWS:{" "}
              {userStats?.reviewCount || (
                <Link to="/dashboard/addReview">Add Review Now</Link>
              )}
            </p>
            <p className="text-blue-600 flex gap-1 items-center">
              <FaBook></FaBook>
              BOOKING: {userStats?.bookings || 0}
            </p>
            <p className="text-yellow-600 flex gap-1 items-center">
              <FaCashRegister></FaCashRegister>
              PAYMENT: {userStats?.totalPayments || 0} time
            </p>
            <p className="text-red-600 flex gap-1 items-center">
              <FaMoneyBill></FaMoneyBill>
              TOTAL PAID: ${userStats?.totalPaid || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
