// init mongoose
var mongoose    = require('mongoose')
  , config      = require('../libs/config.js')
;

// connect
//mongoose.connect('mongodb://derek:immersyve@' + remote + ":" + remoteport + "/metricsdb");
var conn = mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;
//console.log('con='+JSON.stringify(conn));
db.on('error', function (err)
{
    console.log('Mongoose connection error: ', JSON.stringify(err));
});

db.once('open', function callback () 
{
    console.log("Successfully connected to database...");
});

// instantiate schema
var Schema = mongoose.Schema;

////////////////////////////////////////
// initialize models
////////////////////////////////////////
require('./models.js').initialize();
//exports.initialize = function() 
//{
  //console.log(__dirname + "/models/")
  /*require("fs").readdirSync(__dirname + "/models/").forEach(function(file) 
  {
    console.log("+ "+file)
    //require('./models/' + file)();
  });*/
//};
module.exports.Metrics = mongoose.model('Metrics');
module.exports.MetricGroups = mongoose.model('MetricGroups');
module.exports.Logic = mongoose.model('Logic');
module.exports.LogicSets = mongoose.model('LogicSets');
module.exports.LogicItems = mongoose.model('LogicItems');
module.exports.Pages = mongoose.model('Pages');
module.exports.Surveys = mongoose.model('Surveys');
module.exports.Organizations = mongoose.model('Organizations');//, ClientsSchema, "clients");
module.exports.Clients = mongoose.model('Clients');
module.exports.AccessToken = mongoose.model('AccessToken');
module.exports.RefreshToken = mongoose.model('RefreshToken');
module.exports.Users = mongoose.model('Users');
module.exports.Permissions = mongoose.model('Permissions');
module.exports.UserPermissions = mongoose.model('UserPermissions');
module.exports.Projects = mongoose.model('Projects');
module.exports.Products = mongoose.model('Products');
module.exports.Iterations = mongoose.model('Iterations');
module.exports.Triggers = mongoose.model('Triggers');
module.exports.MetricItems = mongoose.model('MetricItems');
module.exports.TableItems = mongoose.model('TableItems');
module.exports.MetricPresets = mongoose.model('MetricPresets');
module.exports.LibraryGroups = mongoose.model('LibraryGroups');
module.exports.Piping = mongoose.model('Piping');
//module.exports.MetricLibraries = mongoose.model('MetricLibraries');


