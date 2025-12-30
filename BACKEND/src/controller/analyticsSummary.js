import ClickStat from "../models/ClickStat.js";

export const getDashboardHourlyStats = async (req, res) => {
    try {
        
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const stats = await ClickStat.find({ createdAt: { $gte: since } })
            .sort({ date:1, hour:1 })
            .lean();

        const result = stats.map(s => ({
            hour: `${String(s.hour).padStart(2,'0')}:00`,
            clicks: s.clicks
        }));

        return res.json(result);
    } catch (e) {
        res.status(500).json({ message:"analytics fetch failed", error:e.message });
    }
}
