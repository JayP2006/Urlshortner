import ClickStat from "../models/ClickStat.js";
import ClickPrediction from "../models/ClickPrediction.js";
import ShortUrl from "../models/shortUrl.model.js";
import {redisClient} from "../config/redis.config.js";

export const getUrlAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    console.log("userId is ", userId);
    const urlDoc = await ShortUrl.findOne({ _id: id, user: userId });
    console.log("urlDoc is ", urlDoc);
    if (!urlDoc) {
      return res.status(404).json({ message: "URL not" });
    }

    // Redis Cache
    const cacheKey = `url-analytics:${userId}:${id}`;

    let cachedData = null;

    try {
      cachedData = await redisClient.get(cacheKey);
    } catch (err) {
      console.error("Redis GET Error:", err.message);
    }

    if (cachedData) {
      console.log("URL ANALYTICS CACHE HIT");
      return res.json(JSON.parse(cachedData));
    }

    console.log("URL ANALYTICS CACHE MISS");

    const stats = await ClickStat.find({ urlId: id })
      .sort({ date: 1, hour: 1 })
      .lean();

    const latestPrediction = await ClickPrediction.findOne({ urlId: id })
      .sort({ generatedAt: -1 })
      .lean();

    const historics = stats.map((s) => {
      const label = `${s.date} ${String(s.hour).padStart(2, "0")}:00`;

      return {
        time: label,
        clicks: s.clicks,
        predicted: null,
      };
    });

    let predictions = [];

    if (latestPrediction) {
      predictions = latestPrediction.points.map((p) => ({
        time: p.time,
        clicks: null,
        predicted: p.predictedClicks,
      }));
    }

    const responseData = {
      url: {
        _id: urlDoc._id,
        short_url: urlDoc.short_url,
        full_url: urlDoc.full_url,
      },
      data: {
        historics,
        predictions,
      },
    };

    // Save in Redis for 60 seconds
    try {
      await redisClient.setEx(
        cacheKey,
        60,
        JSON.stringify(responseData)
      );
    } catch (err) {
      console.error("Redis SET Error:", err.message);
    }

    return res.json(responseData);

  } catch (err) {
    next(err);
  }
};