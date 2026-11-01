import ClickStat from "../models/ClickStat.js";
import {redisClient} from "../config/redis.config.js";

export const getDashboardHourlyStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const cacheKey = `dashboard-hourly-stats:${userId}`;

        // Check Redis cache
        try {
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                console.log("DASHBOARD HOURLY CACHE HIT");
                return res.json(JSON.parse(cachedData));
            }
        } catch (err) {
            console.error("Redis GET Error:", err.message);
        }

        console.log("DASHBOARD HOURLY CACHE MISS");

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const stats = await ClickStat.find({
            createdAt: { $gte: since }
        })
            .sort({ date: 1, hour: 1 })
            .lean();

        const result = stats.map(s => ({
            hour: `${String(s.hour).padStart(2, '0')}:00`,
            clicks: s.clicks
        }));

        // Save in Redis for 60 seconds
        try {
            await redisClient.setEx(
                cacheKey,
                60,
                JSON.stringify(result)
            );
        } catch (err) {
            console.error("Redis SET Error:", err.message);
        }

        return res.json(result);

    } catch (e) {
        res.status(500).json({
            message: "analytics fetch failed",
            error: e.message
        });
    }
};