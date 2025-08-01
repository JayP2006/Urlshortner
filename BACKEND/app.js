import express from "express";
import dotenv from 'dotenv';
import connectDB from "./src/config/mongo.config.js"; 
import shorturlroute from "./src/routes/shortUrl.route.js";
import { redirectToFullUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from 'cors';
import auth_route from "./src/routes/auth.route.js"; 
import cookieParser from "cookie-parser";
import { attachUser } from "./src/utils/attachUser.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(attachUser);

app.use('/api/auth', auth_route);
app.use('/api/url', shorturlroute);

app.get("/:shortCode", redirectToFullUrl); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});