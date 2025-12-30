// BACKEND/cron/predictionCron.js

import cron from "node-cron";
import ShortUrl from "../src/models/shortUrl.model.js";
import { generateClickPredictionForUrl } from "../src/services/predictionService.js";
import { detectSpikeAndAlert } from "../src/services/alertService.js";
import User from "../src/models/user.model.js";

export function monitortrafficSpikes() {

  console.log("🚀 CRON Initialized: Traffic Spike Monitoring Active");

  cron.schedule("0 */3 * * *", async () => {


    try {
      const urls = await ShortUrl.find({ isActive: true }).lean();
      console.log(`📌 Active URLs Found: ${urls.length}`);

      for (const url of urls) {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🔗 URL → ${url.short_url}`);

        try {

          console.log("🔮 Generating AI Prediction...");
          const prediction = await generateClickPredictionForUrl(url);

          if (!prediction) {
            console.log("⚠ Prediction Missing — Skipped");
            continue;
          }

          const user = await User.findById(url.user).lean();
          if (!user || !user.email) {
            console.log("⚠ User Email Missing — Skipped");
            continue;
          }

          console.log("🚨 Checking Spike Trigger...");
          await detectSpikeAndAlert(user, url, prediction);

        } catch (err) {
          console.log("❌ URL Prediction Error:", err.message);
        }
      }

    } catch (err) {
      console.error("🔥 CRON SYSTEM FAILURE:", err.message);
    }
  });
}
