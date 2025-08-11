import { createShortUrlEntry, getFullUrlAndIncrementClicks, getUserShortenedUrls } from '../services/shortUrl.service.js';
import ShortUrl from '../models/shortUrl.model.js'; 
import { generateNanoId } from "../utils/helper.js"; 
import QRCode from 'qrcode';

export const createAndShortenUrl = async (req, res, next) => {
    try {
        const { fullUrl, customAlias, expiresAt } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!fullUrl) {
            return res.status(400).json({ message: 'Full URL is required.' });
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        let generatedShortUrl;
        let qrCodeDataUrl = null;

        const potentialShortCode = customAlias || generateNanoId(7); 
        generatedShortUrl = `${appUrl}/${potentialShortCode}`;

        try {
            qrCodeDataUrl = await QRCode.toDataURL(generatedShortUrl, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000FF',
                    light: '#FFFFFFFF'
                }
            });

        } catch (qrError) {
            console.error('Error generating QR code for URL:', generatedShortUrl, qrError);
        }

        const newUrlEntry = await createShortUrlEntry(fullUrl, customAlias, userId, expiresAt, qrCodeDataUrl);

        generatedShortUrl = `${appUrl}/${newUrlEntry.short_url}`;

        res.status(201).json({
            message: 'URL successfully shortened! You can now view it in My URLs.',
            shortUrl: generatedShortUrl,
            originalUrl: newUrlEntry.full_url,
            qrCodeDataUrl: newUrlEntry.qrCodeDataUrl,
        });
    } catch (error) {
        next(error);
    }
};

export const redirectToFullUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const urlEntry = await getFullUrlAndIncrementClicks(shortCode);

        if (urlEntry) {
            if (urlEntry.expiresAt && urlEntry.expiresAt <= new Date()) {
                return res.status(410).json({ message: 'This short URL has expired.' });
            }
            return res.redirect(urlEntry.full_url);
        } else {
            return res.status(404).json({ message: 'Short URL not found.' });
        }
    } catch (error) {
        next(error);
    }
};

export const getUserLinks = async (req, res, next) => {
    try {
        const userId = req.user ? req.user._id : null;
        console.log("user is", req.user);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to view your URLs.' });
        }
        const userUrls = await getUserShortenedUrls(userId);
        userUrls.forEach(url => {
        if (url.expiresAt && url.expiresAt <= new Date()) {
            url.isActive = false;
            url.save(); // update in DB permanently
        }
        });
        res.status(200).json(userUrls);
    } catch (error) {
        next(error);
    }
};

export const generateQrCode = async (req, res) => {
    const { url } = req.body;

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
};
export const deleteShortUrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user._id : null;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to delete URLs.' });
        }

        const urlEntry = await ShortUrl.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found or you do not have permission to delete it.' });
        }
        console.log("urlEntry is ", urlEntry);
        res.status(200).json({ message: 'Short URL deleted successfully.', urlEntry });
    } catch (error) {
        next(error);
    }
}