const { Schema, model } = require('synz-db');

require('../database/connection');

const pasteSchema = new Schema({
    title: { type: 'string', default: 'Untitled Paste' },
    description: { type: 'string', default: null },
    language: { type: 'string', default: 'plaintext' },
    filename: { type: 'string', default: null },
    content: { type: 'string', required: true },
    createdAt: { type: 'date', default: Date.now },
    views: { type: 'number', default: 0 },
    shortId: { type: 'string', required: true, unique: true },
    userId: { type: 'string', default: null }
}, {
    timestamps: true
});

// static crap
pasteSchema.statics.findByShortId = function (shortId) {
    return this.findOne({ shortId });
};

pasteSchema.statics.findByUserId = function (userId) {
    return this.find({ userId });
};

pasteSchema.statics.generateUniqueShortId = async function (length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortId;
    let exists = true;

    while (exists) {
        shortId = '';
        for (let i = 0; i < length; i++) {
            shortId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const existingPaste = await this.findOne({ shortId });
        if (!existingPaste) {
            exists = false;
        }
    }

    return shortId;
};

pasteSchema.statics.incrementViews = async function (shortId) {
    try {
        const paste = await this.findOne({ shortId });
        if (paste) {
            paste.views = (paste.views || 0) + 1;
            await paste.save();
            return paste;
        }
        return null;
    } catch (error) {
        console.error('Error incrementing views:', error);
        return null;
    }
};

const Paste = model('Paste', pasteSchema);

module.exports = Paste;
