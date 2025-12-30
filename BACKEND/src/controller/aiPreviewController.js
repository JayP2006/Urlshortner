import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);   

export const getAIPreview = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: "URL required" });
        }

        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 AI-LinkPreviewBot" }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $("title").text() || "";
        const description =
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            "";

       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Summarize this webpage in one short professional sentence.
Title: ${title}
Description: ${description}
        `;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();
        console.log("AI Summary:", summary);
        return res.json({
            success: true,
            aiTitle: title,
            aiDescription: description,
            aiSummary: summary
        });

    } catch (err) {
        console.error("AI Preview Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "AI preview failed",
            error: err.message
        });
    }
};
