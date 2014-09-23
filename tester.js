var log                 = require('./v1.0/libs/log')(module);
var mongoose            = require('./v1.0/model/index');
var UserModel           = require('./v1.0/model/index.js').Users;
var ClientModel         = require('./v1.0/model/index.js').Clients;
var AccessTokenModel    = require('./v1.0/model/index.js').AccessToken;
var RefreshTokenModel   = require('./v1.0/model/index.js').RefreshToken;
var faker               = require('Faker');
//console.log('user='+UserModel);
UserModel.remove({}, function(err) {
    var user = new UserModel({ username: "derek@immersyve.com", password: "abc123"});
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password,user.firstName,user.lastName);
    });

    var user = new UserModel({ username: "allen@immersyve.com", password: "abc123"});
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password,user.firstName,user.lastName);
    });

    /*for(i=0; i<4; i++) {
        var user = new UserModel({ username: faker.random.first_name().toLowerCase(), password: faker.Lorem.words(1)[0] });
        user.save(function(err, user) {
            if(err) return log.error(err);
            else log.info("New user - %s:%s",user.username,user.password);
        });
    }*/
});

ClientModel.remove({}, function(err) {
    var client = new ClientModel({ name: "Insight App v1", clientId: "insight_v1", clientSecret:"immersyve" });
    client.save(function(err, client) {
        if(err) return log.error(err);
        else log.info("New client - %s:%s",client.clientId,client.clientSecret);
    });
});
AccessTokenModel.remove({}, function (err) {
    if (err) return log.error(err);
});
RefreshTokenModel.remove({}, function (err) {
    if (err) return log.error(err);
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);