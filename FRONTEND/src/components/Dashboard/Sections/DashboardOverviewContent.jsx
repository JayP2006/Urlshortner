import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdTrendingUp,
  MdCheckCircle,
  MdSpeed,
  MdInsertLink,
  MdBarChart
} from "https://esm.sh/react-icons/md";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border p-5 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <Icon className="text-xl text-indigo-500" />
    </div>

    <div className="mt-3 text-3xl font-bold text-gray-900">
      {loading ? "—" : value}
    </div>
  </motion.div>
);

const DashboardOverviewContent = ({ user, API_BASE_URL }) => {
  const [stats, setStats] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/url/analytics/summary`,
          { credentials: "include" }
        );
        const data = await res.json();

        const hrs = await fetch(
          `${API_BASE_URL}/api/url/analytics/summary/hourly`,
          { credentials: "include" }
        );
        const hourly = await hrs.json();

        setStats(data);
        setHourlyData(hourly);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
    const i = setInterval(load, 30000);
    return () => clearInterval(i);
  }, [API_BASE_URL]);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Live performance overview
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Clicks"
          value={stats?.totalClicks}
          icon={MdTrendingUp}
          loading={loading}
        />
        <StatCard
          title="Active Links"
          value={stats?.activeLinks}
          icon={MdCheckCircle}
          loading={loading}
        />
        <StatCard
          title="CTR"
          value={stats?.ctr}
          icon={MdSpeed}
          loading={loading}
        />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <MdBarChart className="text-indigo-500" />
          Click Activity (Today)
        </h3>

        {hourlyData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-400">
            No traffic yet today
          </div>
        ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="clicks" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Create your next link
          </h3>
          <p className="text-indigo-200 text-sm">
            Start tracking clicks instantly
          </p>
        </div>

        <button className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold flex items-center gap-2">
          <MdInsertLink />
          New Link
        </button>
      </div>
    </div>
  );
};

export default DashboardOverviewContent;
