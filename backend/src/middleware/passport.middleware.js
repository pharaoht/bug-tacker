require('dotenv').config();

const passport = require('passport');

const { Strategy } = require('passport-google-oauth2');

function verifyCallback(accesToken, refreshToken, profile, done){

    const { email, given_name, family_name } = profile;

    done(null, {email, given_name, family_name});
};

passport.use(new Strategy(
    {
        callbackURL: '/api/auth/google/callback',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    verifyCallback

));

passport.serializeUser((user, done) => {

    done(null, user)
});

passport.deserializeUser((obj, done) => {

    done(null, obj)
})