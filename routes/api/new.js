const express = require('express');
const router = express.Router();
const Paste = require('../../models/PasteModel');

const rateLimit = require('express-rate-limit');

const createPasteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => {
        return req.user ? 10 : 5;
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const limit = req.user ? 10 : 5;
        const resetTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

        res.status(429).render('429', {
            title: '429 - Too Many Requests',
            user: req.user || null,
            message: `You've created too many pastes. ${req.user ? 'Logged-in users' : 'Anonymous users'} can create ${limit} pastes every 15 minutes. Please try again at ${resetTime}.`
        });
    },
    keyGenerator: (req) => {
        return req.user ? req.user.discordId : req.ip;
    }
});

router.post('/', createPasteLimiter, async (req, res) => {
    try {
        const { title, description, language, filename, content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const shortId = await Paste.generateUniqueShortId();

        const paste = new Paste({
            title: title || 'Untitled Paste',
            description: description || null,
            language: language || 'plaintext',
            filename: filename || null,
            content: content,
            shortId: shortId,
            userId: req.user ? req.user.discordId : null
        });

        await paste.save();

        res.redirect(`/p/${shortId}`);
    } catch (error) {
        console.error('Error creating paste:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating paste',
            error: error.message
        });
    }
});

module.exports = router;