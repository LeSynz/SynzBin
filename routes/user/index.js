const express = require('express');
const router = express.Router();
const Paste = require('../../models/PasteModel');
const User = require('../../models/UserModel');

router.get('/:discordId', async (req, res) => {
    const discordId = req.params.discordId;

    try {
        const profileUser = await User.findOne({ discordId });

        if (!profileUser) {
            return res.status(404).render('404', {
                message: 'User not found',
                user: req.user || null
            });
        }

        const pastes = await Paste.findByUserId(profileUser.discordId);
        pastes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.render('user', {
            profileUser: profileUser,
            pastes: pastes,
            user: req.user || null,
            req: req,
        });
    } catch (error) {
        console.error('User profile error:', error);
        res.status(500).render('500', {
            message: 'Internal Server Error',
            user: req.user || null
        });
    }
});

module.exports = router;