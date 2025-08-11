import { generateNanoId } from "../utils/helper.js";
import ShortUrl from "../models/shortUrl.model.js";

export const createShortUrlEntry = async (fullUrl, customAlias = null, userId = null, expiresAt = null, qrCodeDataUrl = null) => {
    let shortCode;

    try {
        new URL(fullUrl);
    } catch (error) {
        throw new Error('Invalid full URL format.');
    }

    if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        if (isNaN(expiryDate.getTime())) {
            throw new Error('Invalid expiry date format.');
        }
        if (expiryDate <= new Date()) {
            throw new Error('Expiry date must be in the future.');
        }
    }

    if (customAlias) {
        const existingUrl = await ShortUrl.findOne({ short_url: customAlias });
        if (existingUrl) {
            throw new Error('Custom alias is already in use. Please choose another one.');
        }
        shortCode = customAlias;
    } else {
        let isUnique = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!isUnique && attempts < MAX_ATTEMPTS) {
            shortCode = generateNanoId(7);
            const existingUrl = await ShortUrl.findOne({ short_url: shortCode });
            if (!existingUrl) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate a unique short URL. Please try again.');
        }
    }

    const newShortUrl = new ShortUrl({
        full_url: fullUrl,
        short_url: shortCode,
        clicks: 0, 
        user: userId,
        expiresAt: expiresAt,
        qrCodeDataUrl: qrCodeDataUrl, 
    });

    await newShortUrl.save();
    return newShortUrl;
};

export const getFullUrlAndIncrementClicks = async (shortCode) => {
    const urlEntry = await ShortUrl.findOne({ short_url: shortCode });

    if (urlEntry) {
        if (urlEntry.expiresAt && urlEntry.expiresAt <= new Date()) {
            throw new Error('This short URL has expired.'); 
        }

        urlEntry.clicks++;
        await urlEntry.save();
    }
    return urlEntry;
};

export const getUserShortenedUrls = async (userId) => {
    const userUrls = await ShortUrl.find({ 
        user: userId,isActive: true
    }).sort({ createdAt: -1 });
    return userUrls;
};