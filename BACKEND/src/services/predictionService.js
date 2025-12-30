import { GoogleGenerativeAI } from "@google/generative-ai";
import ClickStat from "../models/ClickStat.js";
import ClickPrediction from "../models/ClickPrediction.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("🔥 Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);
export async function generateClickPredictionForUrl(urlDoc) {
  
  const stats = await ClickStat.find({ urlId: urlDoc._id })
    .sort({ date: 1, hour: 1 })
    .lean();

  if (!stats.length) return null;

  const series = stats.map(s => s.clicks);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an AI model trained for web traffic forecasting.
Below is past hourly click data for a URL:

${JSON.stringify(series)}

Predict next 24 hourly click values.
Return ONLY JSON — no text, no explanation. 
Output format EXAMPLE:
[12,14,9,10,...]
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  const clean = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let predicted;
  try {
    predicted = JSON.parse(clean);
  } catch (err) {
    console.log("\n❌ Gemini output parse error:");
    console.log(text, "\n");
    return null;
  }

  if (!Array.isArray(predicted) || !predicted.length) return null;

  const now = new Date();
  const points = predicted.slice(0, 24).map((value, index) => ({
    time: new Date(now.getTime() + index * 60 * 60 * 1000),
    predictedClicks: Math.max(0, Math.round(value))
  }));

  return await ClickPrediction.create({
    urlId: urlDoc._id,
    horizonHours: 24,
    points
  });
}
