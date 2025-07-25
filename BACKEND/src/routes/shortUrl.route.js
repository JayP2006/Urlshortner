
import express from 'express';
import { createAndShortenUrl, redirectToFullUrl, getUserLinks } from '../controller/shortUrl.controller.js';
import { attachUser } from '../utils/attachUser.js'; 

const router = express.Router();

router.post('/shorten', attachUser, createAndShortenUrl);
router.get('/my-urls', attachUser, getUserLinks);

router.get('/:shortCode', redirectToFullUrl); 

export default router;