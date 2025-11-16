const express = require('express');
const router = express.Router();
const Paste = require('../models/PasteModel');

router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to SynzBin' });
});

router.get('/new', (req, res) => {
    res.render('new', { title: 'Create a New Paste' });
});

router.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const paste = await Paste.findByShortId(shortId);

        if (!paste) {
            return res.status(404).render('404', { message: 'Paste not found' });
        }

        Paste.incrementViews(shortId).catch(err => console.error('View increment error:', err));

        res.render('view', { paste });
    } catch (error) {
        res.status(500).render('500', { message: 'Internal Server Error' });
    }
});

module.exports = router;