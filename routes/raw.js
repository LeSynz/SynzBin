const express = require('express');
const router = express.Router();
const Paste = require('../models/PasteModel');

router.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const paste = await Paste.findByShortId(shortId);

        if (!paste) {
            return res.status(404).send('Paste not found');
        }

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(paste.content);
    } catch (error) {
        console.error('Error fetching raw paste:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;