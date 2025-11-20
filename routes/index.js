const express = require('express');
const router = express.Router();
const Paste = require('../models/PasteModel');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome to SynzBin',
        req: req
    });
});

router.get('/new', (req, res) => {
    res.render('new', {
        title: 'Create a New Paste',
        req: req
    });
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

router.get('/p/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const paste = await Paste.findByShortId(shortId);

        if (!paste) {
            return res.status(404).render('404', { message: 'Paste not found' });
        }

        Paste.incrementViews(shortId).catch(err => console.error('View increment error:', err));

        res.render('view', { paste, req: req });
    } catch (error) {
        res.status(500).render('500', { message: 'Internal Server Error' });
    }
});

module.exports = router;