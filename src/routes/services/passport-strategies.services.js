import passport from 'passport';
import dotenv from 'dotenv';
import models from '../../db/models';

dotenv.config();

const { User } = models;

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

const credentials = {
  facebook: {
    clientID: process.env.FACEBOOK_APP_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    profileFields: ['id', 'email', 'name'],
  },

  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_APP_CALLBACK,
    includeEmail: true,
    profileFields: ['id', 'email', 'name'],
  },

  google: {
    consumerKey: process.env.GOOGLE_CLIENT_ID,
    consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_APP_CALLBACK,
  },
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const facebookAuth = async (accessToken, refreshToken, profile, done) => {
  try {
    const [currentUser] = await User.findOrCreate({
      where: { socialId: profile.id, socialProvider: 'facebook' },
      defaults: {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        socialProvider: profile.provider,
      },
    });
    return done(null, currentUser);
  } catch (err) {
    return done(err);
  }
};

const twitterAuth = async (token, tokenSecret, profile, done) => {
  try {
    const [user] = await User.findOrCreate({
      where: { socialId: profile.id, socialProvider: 'twitter' },
      defaults: {
        firstName: profile.username,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        socialProvider: profile.provider,
      },
    });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const googleAuth = async (token, tokenSecret, profile, done) => {
  console.log('===>>>>', profile);
  const [user] = await User.findOrCreate({
    where: { socialId: profile.id, socialProvider: 'google' },
    defaults: {
      firstName: profile.username,
      username: profile.emails[0].value,
      email: profile.emails[0].value,
      socialProvider: profile.provider,
    },
  });
};

passport.use(new FacebookStrategy(credentials.facebook, facebookAuth));
passport.use(new TwitterStrategy(credentials.twitter, twitterAuth));
passport.use(new GoogleStrategy(credentials.google, googleAuth));

export default passport;
