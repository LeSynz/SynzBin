const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/UserModel');
const Paste = require('../models/PasteModel');

router.get('/', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPastes = await Paste.countDocuments();

        const allPastes = await Paste.find();
        const totalViews = allPastes.reduce((sum, paste) => sum + (paste.views || 0), 0);

        const allUsers = await User.find();
        const recentUsers = allUsers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const recentPastes = allPastes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

        const topPastes = [...allPastes]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        res.render('admin/panel', {
            title: 'Admin Panel',
            user: req.user,
            stats: {
                totalUsers,
                totalPastes,
                totalViews
            },
            recentUsers,
            recentPastes,
            topPastes
        });
    } catch (error) {
        console.error('Admin Panel error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            user: req.user,
            message: 'An error occurred while loading the admin panel.'
        });
    }
});

router.get('/users', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const allUsers = await User.find();
        const sortedUsers = allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const users = sortedUsers.slice(skip, skip + limit);

        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/users', {
            title: 'Manage Users',
            user: req.user,
            users,
            currentPage: page,
            totalPages,
            totalUsers
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            user: req.user,
            message: 'An error occurred while loading users.'
        });
    }
});

router.get('/pastes', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const totalPastes = await Paste.countDocuments();

        const allPastes = await Paste.find();
        const sortedPastes = allPastes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const pastes = sortedPastes.slice(skip, skip + limit);

        const totalPages = Math.ceil(totalPastes / limit);

        res.render('admin/pastes', {
            title: 'Manage Pastes',
            user: req.user,
            pastes,
            currentPage: page,
            totalPages,
            totalPastes
        });
    } catch (error) {
        console.error('Admin pastes error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            user: req.user,
            message: 'An error occurred while loading pastes.'
        });
    }
});

router.get('/system', isAdmin, async (req, res) => {
    try {
        const allPastes = await Paste.find();

        const pasteStorageBytes = allPastes.reduce((total, paste) => {
            const contentSize = Buffer.byteLength(paste.content || '', 'utf8');
            const titleSize = Buffer.byteLength(paste.title || '', 'utf8');
            const descSize = Buffer.byteLength(paste.description || '', 'utf8');
            return total + contentSize + titleSize + descSize;
        }, 0);

        let dbFileSize = 0;

        try {
            const pasteDbPath = path.join(__dirname, '../data/paste.json');
            const userDbPath = path.join(__dirname, '../data/user.json');

            if (fs.existsSync(pasteDbPath)) {
                dbFileSize += fs.statSync(pasteDbPath).size;
            }
            if (fs.existsSync(userDbPath)) {
                dbFileSize += fs.statSync(userDbPath).size;
            }
        } catch (err) {
            console.error('Error reading database files:', err);
        }

        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        };

        res.render('admin/system', {
            title: 'System Information',
            user: req.user,
            systemInfo: {
                nodeVersion: process.version,
                appVersion: require('../package.json').version,
                platform: process.platform,
                memoryUsage: process.memoryUsage(),
                storageUsage: {
                    workingDirectory: process.cwd(),
                    pasteStorage: pasteStorageBytes,
                    pasteStorageFormatted: formatBytes(pasteStorageBytes),
                    databaseFiles: dbFileSize,
                    databaseFilesFormatted: formatBytes(dbFileSize),
                    totalPastes: allPastes.length,
                    avgPasteSize: allPastes.length > 0 ? pasteStorageBytes / allPastes.length : 0
                },
                uptime: process.uptime()
            }
        });
    } catch (error) {
        console.error('Admin system error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            user: req.user,
            message: 'An error occurred while loading system information.'
        });
    }
});

router.post('/users/:discordId/role', isAdmin, async (req, res) => {
    try {
        const { discordId } = req.params;
        const { role } = req.body;

        if (!['user', 'vip', 'admin', 'owner'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        if (['admin', 'owner'].includes(role) && req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        const targetUser = await User.findOne({ discordId });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (targetUser.role === 'owner' && req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Cannot modify owner role' });
        }

        targetUser.role = role;
        await targetUser.save();

        res.json({ success: true, message: 'Role updated successfully' });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/users/:discordId/ban', isAdmin, async (req, res) => {
    try {
        const { discordId } = req.params;
        const { banned } = req.body;

        const targetUser = await User.findOne({ discordId });

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (targetUser.role === 'owner') {
            return res.status(403).json({ success: false, message: 'Cannot ban owner' });
        }

        if (targetUser.discordId === req.user.discordId) {
            return res.status(403).json({ success: false, message: 'Cannot ban yourself' });
        }

        targetUser.banned = banned === 'true';
        await targetUser.save();

        res.json({ success: true, message: banned === 'true' ? 'User banned' : 'User unbanned' });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/users/:discordId', isAdmin, async (req, res) => {
    try {
        const { discordId } = req.params;

        const targetUser = await User.findOne({ discordId });

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (targetUser.role === 'owner') {
            return res.status(403).json({ success: false, message: 'Cannot delete owner' });
        }

        if (targetUser.discordId === req.user.discordId) {
            return res.status(403).json({ success: false, message: 'Cannot delete yourself' });
        }

        await Paste.deleteMany({ userId: discordId });

        await User.deleteMany({ discordId });

        res.json({ success: true, message: 'User and their pastes deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/pastes/:shortId', isAdmin, async (req, res) => {
    try {
        const { shortId } = req.params;
        const paste = await Paste.findOne({ shortId });

        if (!paste) {
            return res.status(404).json({ success: false, message: 'Paste not found' });
        }

        await Paste.deleteMany({ shortId });

        res.json({ success: true, message: 'Paste deleted successfully' });
    } catch (error) {
        console.error('Delete paste error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/users/search', isAdmin, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.redirect('/panel-a8f5e9c2b7/users');
        }

        const allUsers = await User.find();
        const searchTerm = q.toLowerCase();

        const users = allUsers.filter(user =>
            user.username?.toLowerCase().includes(searchTerm) ||
            user.discordId?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm)
        ).slice(0, 50);

        res.render('admin/users', {
            title: 'Search Users',
            user: req.user,
            users,
            searchQuery: q,
            currentPage: 1,
            totalPages: 1,
            totalUsers: users.length
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            user: req.user,
            message: 'An error occurred while searching users.'
        });
    }
});

module.exports = router;