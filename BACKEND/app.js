import express from "express";
import dotenv from "dotenv";
dotenv.config(); 

import connectDB from "./src/config/mongo.config.js"; 
import shorturlroute from "./src/routes/shortUrl.route.js";
import auth_route from "./src/routes/auth.route.js"; 
import user_route from "./src/routes/user.route.js";
import { redirectToFullUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { attachUser } from "./src/utils/attachUser.js";
import nodemailer from "nodemailer";

import { monitortrafficSpikes } from "./cron/predictionCron.js";

// Start CRON after env loaded
monitortrafficSpikes(); 
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://shrinkx.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(attachUser);

app.use('/api/auth', auth_route);
app.use('/api/url', shorturlroute);
app.use('/api/user', user_route);

app.get("/mail-direct-test", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ALERT_FROM_EMAIL,
        pass: process.env.ALERT_FROM_EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.ALERT_FROM_EMAIL,
      to: process.env.ALERT_FROM_EMAIL,
      subject: "🔥 SMTP Test — ShrinkX",
      text: "Email successfully sent from your server 🎉"
    });

    res.send("📩 MAIL SENT → Inbox/Spam check!");
  } catch (err) {
    console.log("SMTP ERROR →", err);
    res.send("❌ SMTP FAILED — CHECK TERMINAL");
  }
});
app.get("/:shortCode", redirectToFullUrl); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
