import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
    MdInsertLink, MdTrendingUp, MdCheckCircle, MdSpeed, MdArrowUpward, MdKeyboardArrowDown,
    MdPeopleOutline, MdFlag, MdOutlineOpenInNew, MdBarChart
} from 'https://esm.sh/react-icons/md';

import { 
    LineChart, Line, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell 
} from 'recharts'; 


const SkeletonLoader = ({ height = 'h-4', width = 'w-3/4' }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${width}`}></div>
);

const PremiumKpiCard = ({ title, value, loading, icon: Icon, sparklineData, subMetric, accentColor }) => {
    return (
        <motion.div
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition duration-200 hover:shadow-lg cursor-pointer`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</h3>
                    <div className={`p-2 rounded-lg bg-${accentColor}-50 text-${accentColor}-600`}>
                        <Icon className="text-xl" />
                    </div>
                </div>

                <p className="text-4xl font-extrabold text-gray-900">
                    {loading ? <SkeletonLoader width="w-24" height="h-10"/> : value}
                </p>

                <div className="mt-4 flex items-center justify-between h-8">
                    {subMetric && (
                        <p className={`text-xs font-semibold flex items-center ${subMetric.isPositive ? 'text-teal-600' : 'text-red-500'}`}>
                            {!loading && subMetric.isPositive ? <MdArrowUpward className="mr-1 h-3 w-3"/> : <MdKeyboardArrowDown className="mr-1 h-3 w-3"/>}
                            {!loading ? subMetric.value : <SkeletonLoader width="w-14" height="h-3"/>}
                        </p>
                    )}

                    {/* Sparkline */}
                    {sparklineData && (
                        <div className="w-1/3 opacity-70">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sparklineData}>
                                    <Line type="monotone" dataKey="clicks" stroke="#6366F1" strokeWidth={2} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const MiniDonutChart = ({ data }) => (
    <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} innerRadius={40} outerRadius={55} dataKey="value">
                    {data.map((v,i)=> <Cell key={i} fill={v.color}/>)}
                </Pie>
                <Tooltip/>
            </PieChart>
        </ResponsiveContainer>
    </div>
);

const DashboardOverviewContent = ({ user, API_BASE_URL }) => {

    const [stats, setStats] = useState({ totalLinks:0, totalClicks:0, activeLinks:0, ctr:"0%", clickGrowth:0, dailyTraffic:0 });
    const [hourlyData, setHourlyData] = useState([]);  // 🔥 LIVE CHART DATA
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                // Fetch summary
                const res = await fetch(`${API_BASE_URL}/api/url/analytics/summary`, { credentials:"include" });
                const meta = await res.json();

                // Fetch hourly click analytics LIVE 🔥
                const hrs = await fetch(`${API_BASE_URL}/api/url/analytics/summary/hourly`, { credentials:"include" });
                const hourly = await hrs.json();

                setHourlyData(hourly);

                setStats({
                    totalLinks: meta.totalLinks,
                    totalClicks: meta.totalClicks,
                    activeLinks: meta.activeLinks,
                    ctr:"4.2%",
                    clickGrowth: 8.5,
                    dailyTraffic: 1540
                });

            } catch(e){ console.log(e) }
            finally{ setLoading(false) }
        }

        loadDashboard();
        const live = setInterval(loadDashboard, 30000); // Auto-refresh 30s
        return () => clearInterval(live);

    }, [API_BASE_URL]);

    const kpi = [
        { title:"Total Clicks", value:stats.totalClicks, icon:MdTrendingUp, subMetric:{value:`+${stats.clickGrowth}%`, isPositive:true}, accentColor:"indigo" },
        { title:"Daily Traffic", value:stats.dailyTraffic, icon:MdPeopleOutline, subMetric:{value:`CTR ${stats.ctr}`, isPositive:true}, accentColor:"blue" },
        { title:"Active Links", value:stats.activeLinks, icon:MdCheckCircle, subMetric:{value:`of ${stats.totalLinks}`, isPositive:true}, accentColor:"teal" },
        { title:"Click Through Rate", value:stats.ctr, icon:MdSpeed, subMetric:{value:"Benchmark 3.5%", isPositive:true}, accentColor:"orange" }
    ];

    return (
        <div className="space-y-10">


            <motion.div className="p-8 bg-white rounded-2xl shadow-sm border"
                initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>

                <h1 className="text-4xl font-extrabold">Welcome back, {user?.name}</h1>
                <p className="text-gray-500">Your traffic is updating live 🔥</p>
            </motion.div>


            <div>
                <h2 className="font-semibold mb-3 text-gray-700">Real-Time Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {kpi.map((c,i)=>(
                        <PremiumKpiCard key={i} {...c} loading={loading}/>
                    ))}
                </div>
            </div>

            <motion.div className="bg-white p-6 rounded-2xl shadow-sm border"
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>

                <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <MdBarChart className="text-indigo-500 mr-2"/> Hourly Click Distribution (Live)
                </h3>

                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData}>
                            <XAxis dataKey="hour" stroke="#64748B"/>
                            <YAxis hide/>
                            <Tooltip/>
                            <Bar dataKey="clicks" fill="#6366F1" radius={[6,6,0,0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>


        
            <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-3"><MdFlag className="inline mr-1"/> Top Geos</h3>
                    <MiniDonutChart data={[
                        {name:"US", value:45, color:"#6366F1"},
                        {name:"IN", value:25, color:"#3B82F6"},
                        {name:"GB", value:15, color:"#0D9488"},
                        {name:"Other", value:15, color:"#E5E7EB"},
                    ]}/>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Create New Campaign</h3>

                    <button className="btn w-full bg-indigo-600 text-white font-bold p-3 rounded-lg hover:bg-indigo-700">
                        <MdInsertLink className="inline mr-1"/> Create Link
                    </button>
                </div>
            </div>

        </div>
    )
}

export default DashboardOverviewContent;
