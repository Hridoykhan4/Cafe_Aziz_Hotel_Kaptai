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
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TbCash, TbTrendingUp, TbArrowUpRight } from "react-icons/tb";
import {
  FaUsers,
  FaUtensils,
  FaShoppingBag,
  FaLeaf,
  FaPizzaSlice,
  FaMugHot,
  FaCookie,
  FaGlassWhiskey,
} from "react-icons/fa";

/* ── palette synced with index.css ── */
const PALETTE = {
  primary: "#0f172a",
  secondary: "#059669",
  accent: "#b45309",
  indigo: "#4f46e5",
  rose: "#e11d48",
  amber: "#d97706",
};

const CAT_COLORS = [
  PALETTE.secondary,
  PALETTE.indigo,
  PALETTE.accent,
  PALETTE.rose,
  "#0891b2",
  "#7c3aed",
];

const CAT_ICONS = {
  salad: FaLeaf,
  pizza: FaPizzaSlice,
  soup: FaMugHot,
  dessert: FaCookie,
  drinks: FaGlassWhiskey,
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  prefix = "",
  suffix = "",
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    className="relative overflow-hidden bg-white rounded-2xl border border-base-200 p-5 group hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
  >
    {/* accent bar */}
    <span
      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
      style={{ background: color }}
    />

    <div className="flex items-start justify-between mb-4">
      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl"
        style={{ background: `${color}18` }}
      >
        <Icon className="text-xl" style={{ color }} />
      </div>
      <span
        className="flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full"
        style={{
          background: `${PALETTE.secondary}12`,
          color: PALETTE.secondary,
        }}
      >
        <TbArrowUpRight className="text-sm" /> Live
      </span>
    </div>

    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">
      {title}
    </p>
    <p
      className="text-3xl font-black text-primary tracking-tight"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {prefix}
      {typeof value === "number" ? value.toLocaleString() : value}
      {suffix}
    </p>
  </motion.div>
);

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-primary/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-sm">
      <p className="font-black capitalize tracking-wide mb-1">{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="font-semibold"
          style={{ color: p.color || "#fff" }}
        >
          {p.name}:{" "}
          {p.name === "revenue" ? `$${Number(p.value).toFixed(2)}` : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   CUSTOM PIE LABEL
───────────────────────────────────────────── */
const RADIAN = Math.PI / 180;
const PieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  if (!percent || percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = Number(cx) + r * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={800}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ─────────────────────────────────────────────
   CUSTOM TRIANGLE BAR
───────────────────────────────────────────── */
const TriBar = ({ fill, x, y, width, height }) => {
  const nx = Number(x),
    ny = Number(y),
    nw = Number(width),
    nh = Number(height);
  return (
    <path
      d={`M${nx},${ny + nh}C${nx + nw / 3},${ny + nh} ${nx + nw / 2},${ny + nh / 3} ${nx + nw / 2},${ny}
          C${nx + nw / 2},${ny + nh / 3} ${nx + (2 * nw) / 3},${ny + nh} ${nx + nw},${ny + nh}Z`}
      fill={fill}
      stroke="none"
    />
  );
};

/* ─────────────────────────────────────────────
   CATEGORY LEGEND ROW
───────────────────────────────────────────── */
const CatLegend = ({ data }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
    {data.map((item, i) => {
      const Icon = CAT_ICONS[item.category] || FaUtensils;
      const color = CAT_COLORS[i % CAT_COLORS.length];
      return (
        <div
          key={item.category}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-base-100 border border-base-200"
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: `${color}15` }}
          >
            <Icon className="text-xs" style={{ color }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none">
              {item.category}
            </p>
            <p className="text-sm font-black text-primary leading-tight">
              {item.quantity} orders
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════
   ADMIN HOME
════════════════════════════════════════════ */
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

  if (isPending) return <LoadingSpinner />;

  const pieData = chartData.map((d) => ({
    name: d.category,
    value: d.revenue,
  }));
  const totalRevenue = stats?.revenue || 0;
  const avgOrderVal = stats?.orders
    ? (totalRevenue / stats.orders).toFixed(2)
    : "0.00";

  /* fake sparkline for avg order — replace with real data if you have it */
  const sparkline = [0.6, 0.9, 0.7, 1.1, 0.85, 1.3, 1.0].map((m, i) => ({
    t: i,
    v: parseFloat((totalRevenue * 0.02 * m).toFixed(2)),
  }));

  const firstName = user?.displayName?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-black tracking-[0.3em] uppercase text-secondary mb-1">
            Admin Dashboard
          </p>
          <h1
            className="text-2xl sm:text-3xl font-black text-primary tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Good to see you, {firstName} 👋
          </h1>
          <p className="text-sm text-primary/40 mt-0.5">
            Here's a live snapshot of Cafe Aziz performance.
          </p>
        </div>

        {/* date badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-base-200 text-sm font-semibold text-primary/50 shrink-0 self-start">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          prefix="$"
          icon={TbCash}
          color={PALETTE.secondary}
          delay={0}
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={FaUsers}
          color={PALETTE.indigo}
          delay={0.07}
        />
        <StatCard
          title="Menu Items"
          value={stats?.menuItems || 0}
          icon={FaUtensils}
          color={PALETTE.accent}
          delay={0.14}
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders || 0}
          icon={FaShoppingBag}
          color={PALETTE.rose}
          delay={0.21}
        />
      </div>

      {/* ── KPI STRIP ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* avg order value */}
        <div className="bg-white border border-base-200 rounded-2xl p-5 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
            style={{ background: `${PALETTE.secondary}12` }}
          >
            <TbTrendingUp
              className="text-2xl"
              style={{ color: PALETTE.secondary }}
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
              Avg Order Value
            </p>
            <p
              className="text-2xl font-black text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ${avgOrderVal}
            </p>
          </div>
        </div>

        {/* sparkline revenue trend */}
        <div className="sm:col-span-2 bg-white border border-base-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                Revenue Trend
              </p>
              <p className="text-sm font-bold text-primary/60">
                Estimated rolling window
              </p>
            </div>
            <span
              className="text-xs font-black px-2 py-1 rounded-full"
              style={{
                background: `${PALETTE.secondary}12`,
                color: PALETTE.secondary,
              }}
            >
              +Live
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sparkline}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={PALETTE.secondary}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={PALETTE.secondary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={PALETTE.secondary}
                  strokeWidth={2}
                  fill="url(#trendGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* ── CHARTS ── */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* BAR — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-base-200 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                  Orders by Category
                </p>
                <h3
                  className="text-base font-black text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Category Breakdown
                </h3>
              </div>
              <span className="text-xs font-bold text-primary/30 bg-base-100 border border-base-200 px-3 py-1.5 rounded-xl">
                All time
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="category"
                    tick={{
                      fontSize: 11,
                      fontWeight: 700,
                      fill: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar
                    dataKey="quantity"
                    shape={<TriBar />}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <CatLegend data={chartData} />
          </motion.div>

          {/* PIE — takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.42 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-base-200 p-5 flex flex-col"
          >
            <div className="mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                Revenue Split
              </p>
              <h3
                className="text-base font-black text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                By Category
              </h3>
            </div>

            <div className="flex-1 min-h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius="80%"
                    innerRadius="42%"
                    labelLine={false}
                    label={PieLabel}
                    paddingAngle={3}
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CAT_COLORS[i % CAT_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]}
                    contentStyle={{
                      background: "#0f172a",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* revenue legend rows */}
            <div className="space-y-2 mt-3">
              {pieData.map((d, i) => {
                const total = pieData.reduce((s, p) => s + p.value, 0);
                const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
                return (
                  <div key={d.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                    />
                    <span className="flex-1 text-xs font-semibold capitalize text-primary/60">
                      {d.name}
                    </span>
                    <span className="text-xs font-black text-primary">
                      ${Number(d.value).toFixed(0)}
                    </span>
                    <span className="text-[10px] font-bold text-primary/30 w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-base-200">
          <span className="text-5xl mb-3">📊</span>
          <p className="text-primary/30 font-heading italic tracking-widest uppercase text-sm">
            No analytics data yet
          </p>
        </div>
      )}

      {/* ── REVENUE TABLE ── */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-2xl border border-base-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-base-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                Performance
              </p>
              <h3
                className="text-base font-black text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Category Summary
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-100 border-b border-base-200">
                  <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                    Category
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                    Orders
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                    Revenue
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                    Avg / Order
                  </th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/35">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => {
                  const color = CAT_COLORS[i % CAT_COLORS.length];
                  const Icon = CAT_ICONS[row.category] || FaUtensils;
                  const avg = row.quantity
                    ? (row.revenue / row.quantity).toFixed(2)
                    : "0.00";
                  const totalRev = chartData.reduce((s, r) => s + r.revenue, 0);
                  const share = totalRev
                    ? ((row.revenue / totalRev) * 100).toFixed(1)
                    : 0;
                  return (
                    <tr
                      key={row.category}
                      className="border-b border-base-100 hover:bg-base-100/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                            style={{ background: `${color}15` }}
                          >
                            <Icon className="text-xs" style={{ color }} />
                          </span>
                          <span className="font-bold capitalize text-primary">
                            {row.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-primary/70">
                        {row.quantity}
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-primary">
                        ${Number(row.revenue).toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-primary/50">
                        ${avg}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-base-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${share}%`, background: color }}
                            />
                          </div>
                          <span className="text-xs font-bold text-primary/40 w-10 text-right">
                            {share}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminHome;
