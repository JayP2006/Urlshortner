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

/* ------------------ Small helpers ------------------ */
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} min ago`;
  return `${Math.floor(diff / 60)} hr ago`;
};

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

/* ------------------ MAIN COMPONENT ------------------ */
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

        const [summaryRes, hourlyRes, linksRes, activityRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/api/url/analytics/summary`, {
              credentials: "include"
            }),
            fetch(`${API_BASE_URL}/api/url/analytics/summary/hourly`, {
              credentials: "include"
            }),
            fetch(`${API_BASE_URL}/api/url/analytics/recent-links`, {
              credentials: "include"
            }),
            fetch(`${API_BASE_URL}/api/url/analytics/recent-activity`, {
              credentials: "include"
            })
          ]);

        setStats(await summaryRes.json());
        setHourlyData(await hourlyRes.json());
        setRecentLinks(await linksRes.json());
        setRecentActivity(await activityRes.json());

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
          Live data from your existing analytics
        </p>
      </div>

      {/* CORE STATS */}
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
          title="Total Links"
          value={stats?.totalLinks}
          icon={MdInsertLink}
          loading={loading}
        />
      </div>

      {/* HOURLY CHART */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <MdBarChart className="text-indigo-500" />
          Click Activity (Today)
        </h3>

        {hourlyData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-400">
            No clicks yet today
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

      {/* RAW ACTIVITY (FROM EXISTING MODELS) */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT LINKS */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold mb-4">New Links</h3>
          {recentLinks.length === 0 ? (
            <p className="text-gray-400 text-sm">No links created yet</p>
          ) : (
            recentLinks.map(l => (
              <div key={l._id} className="flex justify-between py-1 text-sm">
                <span className="text-indigo-600">/{l.shortCode}</span>
                <span className="text-gray-400">
                  {timeAgo(l.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* RECENT ACTIVITY (HOURLY) */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity yet</p>
          ) : (
            recentActivity.map(a => (
              <div key={a._id} className="flex justify-between py-1 text-sm">
                <span>
                  /{a.urlId?.short_url} → {a.clicks} clicks
                </span>
                <span className="text-gray-400">
                  {a.hour}:00
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* CTA */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Create your next link
          </h3>
          <p className="text-indigo-200 text-sm">
            Everything here is driven by real backend data
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
