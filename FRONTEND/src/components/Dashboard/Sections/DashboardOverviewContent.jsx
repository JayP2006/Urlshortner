import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdTrendingUp,
  MdCheckCircle,
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

/* ================= TIME HELPER (SINGLE SOURCE OF TRUTH) ================= */

const timeAgo = (date) => {
  if (!date) return "";

  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

/* ================= SMALL UI ================= */

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <Icon className="text-xl text-indigo-500" />
    </div>

    <div className="mt-4 text-4xl font-extrabold text-gray-900">
      {loading ? "—" : value}
    </div>
  </motion.div>
);

/* ================= MAIN COMPONENT ================= */

const DashboardOverviewContent = ({ user, API_BASE_URL }) => {
  const [stats, setStats] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [
          summaryRes,
          hourlyRes,
          linksRes,
          activityRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/url/analytics/summary`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/url/analytics/summary/hourly`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/url/analytics/recent-links`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/url/analytics/recent-activity`, { credentials: "include" })
        ]);

        setStats(await summaryRes.json());
        setHourlyData(await hourlyRes.json());
        setRecentLinks(await linksRes.json());
        setRecentActivity(await activityRes.json());

      } catch (err) {
        console.error("Dashboard load error:", err);
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
      <div className="bg-white rounded-3xl border p-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500 mt-2">
          Live dashboard powered by real backend analytics
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Clicks" value={stats?.totalClicks} icon={MdTrendingUp} loading={loading} />
        <StatCard title="Active Links" value={stats?.activeLinks} icon={MdCheckCircle} loading={loading} />
        <StatCard title="Total Links" value={stats?.totalLinks} icon={MdInsertLink} loading={loading} />
      </div>

      {/* HOURLY CHART */}
      <div className="bg-white rounded-3xl border p-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <MdBarChart className="text-indigo-500" />
          Click Activity (Today)
        </h3>

        {hourlyData.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-gray-400">
            No traffic yet today
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="clicks" fill="#6366F1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* LISTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* NEW LINKS */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold mb-4">New Links</h3>

          {recentLinks.length === 0 ? (
            <p className="text-gray-400 text-sm">No links created yet</p>
          ) : (
            recentLinks.map(link => (
              <div
                key={link._id}
                className="flex justify-between py-2 text-sm border-b last:border-none"
              >
                <span className="font-medium text-indigo-600">
                  /{link.short_url}
                </span>
                <span className="text-gray-400">
                  {timeAgo(link.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* RECENT ACTIVITY – FIXED TIME */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity yet</p>
          ) : (
            recentActivity.map(a => (
              <div
                key={a._id}
                className="flex justify-between py-2 text-sm border-b last:border-none"
              >
                <span>
                  <span className="font-medium text-indigo-600">
                    /{a.urlId?.short_url}
                  </span>{" "}
                  received {a.clicks} clicks
                </span>

                <span className="text-gray-400">
                  {timeAgo(a.updatedAt || a.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* CTA */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            Create your next link
          </h3>
          <p className="text-indigo-200 text-sm">
            Everything updates automatically from real analytics
          </p>
        </div>

        <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition">
          <MdInsertLink />
          New Link
        </button>
      </div>
    </div>
  );
};

export default DashboardOverviewContent;
