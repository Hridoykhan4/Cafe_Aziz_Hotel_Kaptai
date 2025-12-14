import { Helmet } from "react-helmet-async";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import { TbCash } from "react-icons/tb";
import { FaUsers, FaUtensils, FaShoppingBag } from "react-icons/fa";

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5 }}
    className={`relative overflow-hidden rounded-2xl p-6 shadow-xl text-white ${gradient}`}
  >
    <div className="absolute -top-6 -right-6 opacity-20">
      <Icon size={100} />
    </div>

    <div className="relative z-10">
      <p className="text-sm uppercase tracking-wider opacity-90">{title}</p>
      <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
    </div>
  </motion.div>
);

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

// #region Sample data

// #endregion
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return (
    <path
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke="none"
      fill={fill}
    />
  );
};


const AdminHome = () => {
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isPending } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure("/admin-stats");
      return data;
    },
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/order-stats");
      return data;
    },
  });
  const pieData = chartData.map((item) => ({
    name: item.category,
    value: item.revenue,
  }));

  if (isPending) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Bistro | Admin Dashboard</title>
      </Helmet>

      {/* HEADER */}
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
          <p className="text-gray-500 mt-1">
            Here’s what’s happening with your restaurant today
          </p>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.revenue || 0}`}
          icon={TbCash}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={FaUsers}
          gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
        />
        <StatCard
          title="Menu Items"
          value={stats?.menuItems || 0}
          icon={FaUtensils}
          gradient="bg-gradient-to-br from-pink-500 to-rose-600"
        />
        <StatCard
          title="Orders"
          value={stats?.orders || 0}
          icon={FaShoppingBag}
          gradient="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      {/* INSIGHT PANEL (OPTIONAL) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📊 Quick Insight
        </h3>
        <p className="text-gray-600">
          Your restaurant performance is looking strong.
        </p>
      </motion.div>

      {/* Chart and PIE */}
      {chartData.length === 0 && (
        <p className="text-center text-gray-400">No analytics available</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📦 Orders by Category
          </h3>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Bar dataKey="quantity" shape={TriangleBar}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* PIE CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💰 Revenue Distribution
          </h3>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                  outerRadius={100}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;
