import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyAyptmAXr_DefAptDkMGyvDp7_aGqSI1e0");

export const generatePrediction = async (pastClicks) => {

    if (!pastClicks || pastClicks.length < 2) return [10,15,20,25,30,35,40,45,50,60,70,80];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        Past hourly clicks: [${pastClicks.join(",")}]
        Predict next 12 hourly clicks as PURE JSON array.
        No explanation. No text. No sentences. Only JSON strictly like:

        [120,150,180,200,250,300,280,260,240,200,160,120]
    `;

    const result = await model.generateContent(prompt);
    let output = await result.response.text();

    output = output.replace(/(Given|Prediction|Estimated|:)/gi, "");
    output = output.replace(/```json|```/gi, "").trim();

    const arrayMatch = output.match(/\[.*?\]/s);

    if (!arrayMatch) return [10,20,30,40,50,60,70,80,90,100,95,80]; // fallback safe return

    return JSON.parse(arrayMatch[0]);
};

