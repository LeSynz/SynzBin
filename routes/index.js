const express = require('express');
const router = express.Router();
const Paste = require('../models/PasteModel');
const User = require('../models/UserModel');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome to SynzBin',
        user: req.user || null,
        req: req
    });
});

router.get('/new', (req, res) => {
    res.render('new', {
        title: 'Create a New Paste',
        user: req.user || null,
        req: req
    });
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

router.get('/terms', (req, res) => {
    res.render('terms', {
        title: 'Terms of Service',
        user: req.user || null,
        req: req
    });
});

router.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Privacy Policy',
        user: req.user || null,
        req: req
    });
});

router.get('/p/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const paste = await Paste.findByShortId(shortId);

        if (!paste) {
            return res.status(404).render('404', {
                message: 'Paste not found',
                user: req.user || null,
                req: req
            });
        }

        Paste.incrementViews(shortId).catch(err => console.error('View increment error:', err));

        let pasteCreator = null;
        if (paste.userId) {
            pasteCreator = await User.findOne({ discordId: paste.userId });
        }

        res.render('view', {
            paste,
            pasteCreator: pasteCreator,
            user: req.user || null,
            req: req
        });
    } catch (error) {
        console.error('Paste view error:', error);
        res.status(500).render('500', {
            message: 'Internal Server Error',
            user: req.user || null,
            req: req
        });
    }
});

module.exports = router;