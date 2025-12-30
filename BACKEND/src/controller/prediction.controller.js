import ShortUrl from "../models/shortUrl.model.js";
import { generatePrediction } from "../utils/aiPredictor.js";

export const getPredictions = async (req, res) => {
    try {
        const recent = await ShortUrl.find().sort({ createdAt:-1 }).limit(12);
        const clicks = recent.map(u => u.clicks); 

        if (!clicks.length) return res.json({ future:[10,15,20,25,30,28,26,22,18,15,10,8] });

        const future = await generatePrediction(clicks);

        return res.json({ future }); 
    } 
    catch (e) {
        console.error("Prediction fetch error:", e.message);
        return res.json({ future:[5,8,10,15,20,18,16,14,12,10,8,5] });
    }
};
