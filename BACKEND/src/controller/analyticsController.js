import ClickStat from "../models/ClickStat.js";
import ClickPrediction from "../models/ClickPrediction.js";
import ShortUrl from "../models/shortUrl.model.js";

export const getUrlAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const urlDoc = await ShortUrl.findOne({ _id: id, user: userId });
    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found" });
    }

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

    return res.json({
      url: {
        _id: urlDoc._id,
        short_url: urlDoc.short_url,
        full_url: urlDoc.full_url,
      },
      data: {
        historics,
        predictions,
      },
    });
  } catch (err) {
    next(err);
  }
};
