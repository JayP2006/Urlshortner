import nodemailer from "nodemailer";
import ClickStat from "../models/ClickStat.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_FROM_EMAIL,
    pass: process.env.ALERT_FROM_EMAIL_PASS,
  },
});

export async function sendSpikeAlertEmail(userEmail, urlDoc, point, baseline) {

  const formattedTime = point.time
      ? new Date(point.time).toLocaleString()
      : "Not Available";

  const mailOptions = {
    from: process.env.ALERT_FROM_EMAIL,
    to: userEmail,
    subject: `🚨 Traffic Spike Alert — ${urlDoc.short_url}`,
    html: `
      <h2>Traffic Spike Detected 🚀</h2>
      <p>Your link may receive unusually high traffic:</p>

      <p><b>${urlDoc.short_url}</b> → ${urlDoc.full_url}</p>
      <br>
      <p><b>Expected Time:</b> ${formattedTime}</p>
      <p><b>Predicted Clicks:</b> ${point.predictedClicks}</p>
      <p><b>Baseline Avg/hr:</b> ${baseline}</p>

      <hr>
      <a href="${process.env.FRONTEND_BASE_URL}/analytics/${urlDoc._id}"
         style="padding:10px 14px;background:#4f46e5;color:white;border-radius:6px;
                text-decoration:none;font-size:14px;">
         View Dashboard
      </a>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📩 Email Sent Successfully →", userEmail);
}


export async function detectSpikeAndAlert(user, urlDoc, predictionDoc) {

  const last24 = new Date(Date.now() - 24*60*60*1000);

  const stats = await ClickStat.find({ 
    urlId: urlDoc._id,
    createdAt: { $gte:last24 }
  });

  const baseline = stats.length
      ? (stats.reduce((a,b)=>a+b.clicks,0) / stats.length).toFixed(1)
      : 1;  // default so test mail triggers easily

  const minClicks =50;    // 🔥 test friendly
  const threshold = 2.0;  // 20% spike = alert


  for (const point of predictionDoc.points) {

    if (point.predictedClicks >= minClicks &&
        point.predictedClicks >= baseline * threshold) {

      console.log("🚨 Spike Detected — Sending Email...");

      await sendSpikeAlertEmail(
        user.email,
        urlDoc,
        point,
        baseline
      );

      return; // only one mail per cycle
    }
  }

  console.log("⚠ No Spike — No Email");
}
