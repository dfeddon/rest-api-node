var config                  = require('../libs/config');
var passport                = require('passport');
var BasicStrategy           = require('passport-http').BasicStrategy;
var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;
var UserModel               = require('../model/index.js').Users;
var ClientModel             = require('../model/index.js').Clients;
var AccessTokenModel        = require('../model/index.js').AccessToken;
var RefreshTokenModel       = require('../model/index.js').RefreshToken;

passport.use(new BasicStrategy(
    function(username, password, done) {//console.log("HIHIHIHIHIHI2")
        ClientModel.findOne({ clientId: username }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != password) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {//console.log(":: "+clientId,clientSecret)
        ClientModel.findOne({ clientId: clientId }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != clientSecret) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new
 BearerStrategy(
    function(accessToken, done) {//console.log("HHHHHHHH1");
        AccessTokenModel.findOne({ token: accessToken }, function(err, token) 
        {
            console.log("token "+token+"/"+config.get('security:tokenLife'));
            if (err) { return done(err); }
            if (!token) { return done(null, false); }

            if( Math.round((Date.now()-token.dateCreated)/1000) > config.get('security:tokenLife') ) {
                AccessTokenModel.remove({ token: accessToken }, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, { message: 'Token expired' });
            }

            UserModel.findById(token.userId, function(err, user) {
                //console.log("ccccc")
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user' }); }

                var info = { scope: '*' }
                done(null, user, info);
            });
        });
    }
));