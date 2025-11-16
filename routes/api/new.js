const express = require('express');
const router = express.Router();
const Paste = require('../../models/PasteModel');

router.post('/', async (req, res) => {
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
            shortId: shortId
        });

        await paste.save();

        res.redirect(`/${shortId}`);
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