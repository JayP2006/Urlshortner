import express from 'express';
import { createAndShortenUrl, redirectToFullUrl, getUserLinks, deleteShortUrl, createProtectedAndShortenUrl, createLocationBasedLink, getAnalyticsSummary } from '../controller/shortUrl.controller.js';
import { attachUser } from '../utils/attachUser.js';
import { getAIPreview } from '../controller/aiPreviewController.js'
import { getDashboardHourlyStats } from "../controller/analyticsSummary.js";
import QRCode from 'qrcode'; 
import { getUrlAnalytics } from '../controller/analyticsController.js';
import { generateClickPredictionForUrl } from '../services/predictionService.js';
import { getPredictions } from '../controller/prediction.controller.js';
import ShortUrl from '../models/shortUrl.model.js';
import ClickStat from '../models/ClickStat.js';

const router = express.Router();

router.post('/shorten', attachUser, createAndShortenUrl);
router.post('/protected-shorten', attachUser, createProtectedAndShortenUrl);
router.post('/location-shorten', attachUser, createLocationBasedLink);

router.get('/my-urls', attachUser, getUserLinks);
router.delete('/:id',attachUser,deleteShortUrl);
router.post("/ai-preview", getAIPreview);
router.get('/analytics/summary', attachUser, getAnalyticsSummary);


router.post('/generate-qr-code', attachUser, async (req, res) => {
    const { url } = req.body;
    console.log("url is ",url);

    if (!url) {
        return res.status(400).json({ message: 'URL is required to generate QR code.' });
    }

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H', 
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000FF', 
                light: '#FFFFFFFF' 
            }
        });

        res.status(200).json({ qrCodeDataUrl });

    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Failed to generate QR code.', error: error.message });
    }
});
router.get("/analytics/recent-links", attachUser, async (req, res) => {
  const links = await ShortUrl.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("short_url createdAt isActive");

  res.json(links);
})
router.get("/analytics/recent-activity", attachUser, async (req, res) => {
  try {
    const activity = await ClickStat.find()
      .sort({ date: -1, hour: -1 })
      .limit(5)
      .populate("urlId", "short_url");

    res.json(activity);
  } catch (e) {
    res.status(500).json({ message: "Failed to load activity" });
  }
});

router.get("/analytics/predictions", getPredictions);
router.get("/analytics/summary/hourly", getDashboardHourlyStats);
router.get("/:id/analytics",attachUser , getUrlAnalytics);

router.get('/:shortCode', redirectToFullUrl); 

router.post('/check-protected-link/:shortCode', redirectToFullUrl);

export default router;
