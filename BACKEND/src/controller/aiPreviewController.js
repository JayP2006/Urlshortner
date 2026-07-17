import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);   


export const getAIPreview = async (req, res) => {
    try {
        console.log("gemini api key is ", process.env.GEMINI_API_KEY);
        const { url } = req.body;
        console.log("Received URL for AI preview:", url);
        if (!url) {
            return res.status(400).json({ success: false, message: "URL required" });
        }

        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 AI-LinkPreviewBot" }
        });
        console.log("respone" , response.data);
        const html = response.data;
        const $ = cheerio.load(html);

        const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    "";

    const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";

    const image =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        "";

    const favicon =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        "/favicon.ico";

    const siteName =
        $('meta[property="og:site_name"]').attr("content") ||
        new URL(url).hostname;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            console.log("Generating AI preview for URL:", url);
            const prompt = `
    Summarize this webpage in one short professional sentence.
    Title: ${title}
    Description: ${description}
            `;

        const result = await model.generateContent(prompt);
        console.log("AI Preview Result:", result);
        const summary = result.response.text();
        console.log("AI Summary:", summary);
        return res.json({
    success: true,
    aiTitle: title,
    aiDescription: description,
    aiSummary: summary,
    image,
    favicon: favicon.startsWith("http")
        ? favicon
        : new URL(favicon, url).href,
    siteName,
    domain: new URL(url).hostname
});

    } catch (err) {
        console.error("AI Preview Error: This website block preview");
        return res.status(500).json({
            success: false,
            message: "This website block preview",
            error: err.message
        });
    }
};
