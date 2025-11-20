const { Schema, model } = require('synz-db');

require('../database/connection');

const userSchema = new Schema({
    discordId: { type: 'string', required: true, unique: true },
    username: { type: 'string', required: true },
    avatar: { type: 'string', default: null },
    email: { type: 'string', default: null },
    createdAt: { type: 'date', default: Date.now },
    pastes: { type: 'array', default: [] },
    refreshToken: { type: 'string', default: null },
}, {
    timestamps: true
});

const User = model('User', userSchema);

// static shit here

module.exports = User;