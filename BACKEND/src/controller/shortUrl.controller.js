import { createShortUrlEntry, getFullUrlAndIncrementClicks, getUserShortenedUrls } from '../services/shortUrl.service.js';

export const createAndShortenUrl = async (req, res, next) => {
    try {
        const { fullUrl, customAlias, expiresAt } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!fullUrl) {
            return res.status(400).json({ message: 'Full URL is required.' });
        }

        const newUrlEntry = await createShortUrlEntry(fullUrl, customAlias, userId, expiresAt); 
        
        const fullShortUrl = `${process.env.APP_URL || 'http://localhost:3000'}/${newUrlEntry.short_url}`;

        res.status(201).json({
            message: 'URL successfully shortened! You can now view it in My URLs.',
            shortUrl: fullShortUrl,
            originalUrl: newUrlEntry.full_url,
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
            return res.redirect(urlEntry.full_url);
        } else {
            return res.status(404).json({ message: 'Short URL not found.' });
        }
    } catch (error) {
        if (error.message === 'This short URL has expired.') {
            return res.status(410).json({ message: error.message });
        }
        next(error);     }
};

export const getUserLinks = async (req, res, next) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to view your URLs.' });
        }
        const userUrls = await getUserShortenedUrls(userId);
        res.status(200).json(userUrls);
    } catch (error) {
        next(error);
    }
};