require('dotenv').config();

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/UserModel');

passport.serializeUser((user, done) => {
    done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await User.findOne({ discordId });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });

        if (!user) {
            user = new User({
                discordId: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                email: profile.email,
                refreshToken: refreshToken
            });
            await user.save();
        } else {
            user.username = profile.username;
            user.avatar = profile.avatar;
            user.email = profile.email;
            user.refreshToken = refreshToken;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;