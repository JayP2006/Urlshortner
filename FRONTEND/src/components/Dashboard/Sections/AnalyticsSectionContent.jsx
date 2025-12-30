import React, { useState, useEffect } from 'react';
import { MdLanguage, MdPeopleOutline, MdInsertLink, MdCheckCircle, MdSpeed } from 'https://esm.sh/react-icons/md';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

const KpiCard = ({ title, value, colorClass, icon: Icon, loading }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg text-white ${colorClass}`}>
                <Icon className="text-xl"/>
            </div>
            <p className="text-xs font-medium text-gray-600 uppercase">{title}</p>
        </div>
        <p className="text-3xl font-extrabold text-gray-900">
            {loading ? <div className="animate-pulse w-20 h-6 bg-gray-200 rounded"/> : value}
        </p>
    </div>
);

export default function AnalyticsSectionContent({ API_BASE_URL }) {

    const [analyticsData, setAnalyticsData] = useState(null);
    const [predictedData, setPredictedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${API_BASE_URL}/api/url/analytics/summary`, { credentials:"include" });
                const data = await res.json();
                setAnalyticsData(data);

                const pre = await fetch(`${API_BASE_URL}/api/url/analytics/predictions`, { credentials:"include" });
                const pJSON = await pre.json();

                setPredictedData(
    (pJSON.future || []).map((value, index) => ({
        name: `+${index + 1}h`,   // ⬅ Correct — no date conversion
        predicted: value
    }))
);

            } catch(err){ setError(err.message);}
            finally{ setLoading(false); }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center font-semibold text-indigo-600">Loading...</div>;
    if (error) return <div className="p-6 bg-red-100 border border-red-300 rounded-xl text-red-700">{error}</div>;


    const topCountriesData = analyticsData.topCountries || [];
    const clicksOverTimeData = analyticsData.clicksOverTime || [];

    const metricData = [
        { title:"Total Clicks", value:analyticsData.totalClicks, icon:MdPeopleOutline, colorClass:"bg-indigo-600" },
        { title:"Total Links", value:analyticsData.totalLinks, icon:MdInsertLink, colorClass:"bg-teal-600" },
        { title:"Active Links", value:analyticsData.activeLinks, icon:MdCheckCircle, colorClass:"bg-blue-600" },
        { title:"Avg/Link", value:analyticsData.averageClicksPerLink, icon:MdSpeed, colorClass:"bg-orange-600" },
    ];

    return (
        <div className="space-y-8">

            <h2 className="text-3xl font-extrabold text-gray-900">Advanced Analytics Dashboard</h2>
            <p className="text-gray-500">Past + AI Predicted Click Traffic</p>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricData.map((m,i)=>(
                    <KpiCard key={i} {...m}/>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Clicks Over Time (Last 7 Days)</h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clicksOverTimeData}>
                                <CartesianGrid stroke="#E5E7EB"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="clicks" fill="#6366F1" radius={[5,5,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-2xl shadow-xl border">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <MdLanguage className="text-indigo-600 mr-2"/>Top Countries
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCountriesData} layout="vertical">
                                <CartesianGrid stroke="#F3F4F6"/>
                                <XAxis type="number"/>
                                <YAxis type="category" dataKey="name"/>
                                <Tooltip/>
                                <Bar dataKey="clicks" fill="#3B82F6" radius={[0,5,5,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

    
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-purple-700 mb-2">AI NEXT-HOUR TRAFFIC PREDICTION 🔮</h3>
                <p className="text-sm text-gray-500 mb-4">AI predicted future clicks — growth pattern insight.</p>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictedData}>
                            <CartesianGrid stroke="#E5E7EB"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="predicted" stroke="#A855F7" strokeWidth={3} dot/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
