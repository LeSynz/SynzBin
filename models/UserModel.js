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
    role: { type: 'string', enum: ['user', 'vip', 'admin', 'owner'], default: 'user' },
    banned: { type: 'boolean', default: false }
}, {
    timestamps: true
});

// static shit here

userSchema.statics.totalUsers = function () {
    return this.countDocuments();
};

const User = model('User', userSchema);

module.exports = User;