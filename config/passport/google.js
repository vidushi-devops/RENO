'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');
const User = mongoose.model('User');

/**
 * Expose
 */

const clientID = config.google.clientID!==undefined?config.google.clientID:'_'; //preventing a crash in the GoogleStrategy if we do not have a clientid
console.log(clientID, 'clientID')
module.exports = new GoogleStrategy({
    clientID: clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { 'google.id': profile.id }
    };
    User.load(options, function (err, user) {
      if (err) return done(err);
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'google',
          google: profile._json
        });
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
);
