
var express       = require('express')
  , async         = require('async')
  , mongoose      = require('./models/index.js')
  , clients       = require('./routes/v1.0/clients')
  , metrics       = require('./routes/v1.0/metrics')
  , metricgroups  = require('./routes/v1.0/metricgroups')
  , pages         = require('./routes/v1.0/pages')
  , surveys       = require('./routes/v1.0/surveys')
  //, studies       = require('./routes/v1.0/studies')
  //, iterations    = require('./routes/v1.0/iterations')
  //, products      = require('./routes/v1.0/products')
  //, projects      = require('./routes/v1.0/projects')

// start express
var app = express();

// mongo configs
/*var remote = '107.170.249.243'; // 15069
var remoteport = 15069;
var local = 'hal3000.local'; // 27017
var localport = 27017
var database = 'metricsdb';

// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + remote + ":15069");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback()
{
  console.log("we're in!");

  // for embedded items, see [http://mongoosejs.com/docs/populate.html]
  var metricsSchema = mongoose.Schema
  (
    {
      name: String   
    }
  );

  metricsSchema.methods.validate = function()
  {

  }

  var Metric = mongoose.model('Metric', metricsSchema);
  var silence = new Metric({name: 'Silence'});
  console.log(silence.name);
});*/

// start
/*var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

// connect
var server = new Server(remote, remoteport, {auto_reconnect: true}, {safe: true});
db = new Db(database, server);
db.authenticate("derek", "immersyve", function(err, res){});
db.open
(
  function(err, db) 
  {
      if(err) 
      {
        console.log("mongo open error");
      }
      else console.log("mongo opened");
  }
);*/


// simple logger
app.use(function(req, res, next)
{
  // return size (no. name-value pairs) of query string
  res.locals.getQuerySize=function()
  {
    //var obj = req.query;
    var size = 0, key;
    for (key in req.query) 
    {
        if (req.query.hasOwnProperty(key)) size++;
    }
    return size;
  }

  // converts querystring to mongo criteria (eg: search)
  res.locals.queryToMongo=function()
  {
    var query = {};
    var val;
    Object.keys(req.query).forEach(function(key)
    {
      val = req.param(key);

      // value type conversions
      if (val == "true") val = true;
      if (val == "false") val = false;
      if (val === parseInt(val)) val = parseInt(val);

      // build Mongo query object
      query[key] = val;
    });
    return query;
  }

  // find item by id
  res.locals.getById=function(coll, id)
  {
    console.log("### getById");
    //id = "53445f05e6fe19941018616c";
    db.collection(coll, function(err, collection) 
    {
        collection.findOne(
          {
            '_id':new BSON.ObjectID(id)
          }, 
          function(err, item) 
          {
              if (err) console.log("ERROR " + err);
              console.log("item = "+item.name);
              return item;
          }
        );
    });

  }
  // console logging
  console.log('%s %s', req.method, req.url);
  // required
  next();
});

var allowedDomains = "*";// test.com anotherdomain.com"; // or || delimiter
//CORS middleware
var allowCrossDomain = function(req, res, next) 
{
    res.header('Access-Control-Allow-Origin', allowedDomains);//config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
 
app.configure(function () 
{
    app.use(express.favicon()); // use standard favicon
    app.use(express.logger('dev')); // log all requests : 'default', 'short', 'tiny', 'dev'
    app.use(express.bodyParser()); // json parsing
    app.use(express.methodOverride()); // HTTP PUT and DELETE support
    app.use(allowCrossDomain); // CORS middleware
    app.use(app.router); // simple route management
    /*app.use(express.session
    (
      {
        secret: '<h1>WHEEYEEE</h1>',
        key: 'sid',
        cookie: 
        {
          secret: true,
          expires: false      
        }
      })
    );*/
      //app.use(express.static(path.join(__dirname, "public"))); // starting static fileserver, that will watch `public` folder (in our case there will be `index.html`)
});

app.all('/', function(req, res, next) 
{
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //res.set('X-Catch-All', 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
 });

/*
  http://expressjs.com/3x/api.html

  REQUESTS:
  req.params : GET /user/tj is req.params.name outputs "tj"
  req.param('name') : where ?name=tobe and /user/tobi for /user/:name outputs "tobi"
  req.body : POST user[name]=tobi&user[email]=tobi@email.com is req.body.user.name outputs "tobi"
  req.query : GET /search?q=tobi+ferret is req.query.q outputs "tobi ferret"
  req.route
  req.cookies : where cookie: name=tj is req.cookies.name and outputs "tj"
  req.signedCookies
  req.ip
  req.ips
  req.path : example.com/users?sort=desc is req.path outputs "/users"
  req.host : example Host: "example.com:3000" is req.host outputs "example.com"
  req.fresh
  req.stale
  req.xhr
  req.protocol
  req.secure
  req.originalUrl
  
  RESPONSE:

*/
app.get('/', function(req, res)
{
  res.send(req.query);
});

// data: db = mongo/mongoose | bson = mongo:BSON
var data = 
{
  //"db":mongoose.db,
  "mongoose":mongoose
  //"BSON":BSON
};

////////////////////////////
// metrics
////////////////////////////
app.get('/api/metrics', metrics.findAll(data));
app.get('/api/metrics/:id', metrics.findById(data));
app.post('/api/metrics', metrics.addMetrics(data));
app.put('/api/metrics/:id', metrics.updateMetrics(data));
app.delete('/api/metrics/:id', metrics.deleteMetrics(data));
app.patch('/api/metrics/:id', metrics.patchMetrics(data));

////////////////////////////
// metricgroups
////////////////////////////
app.get('/api/metricgroups', metricgroups.findAll(data));
app.get('/api/metricgroups/:id', metricgroups.findById(data));
app.post('/api/metricgroups', metricgroups.addMetricgroups(data));
app.put('/api/metricgroups/:id', metricgroups.updateMetricgroups(data));
app.delete('/api/metricgroups/:id', metricgroups.deleteMetricgroups(data));
app.patch('/api/metricgroups/:id', metricgroups.patchMetricgroups(data));

////////////////////////////
// pages
////////////////////////////
app.get('/api/pages', pages.findAll(data));
app.get('/api/pages/:id', pages.findById(data));
app.post('/api/pages', pages.addPages(data));
app.put('/api/pages/:id', pages.updatePages(data));
app.delete('/api/pages/:id', pages.deletePages(data));

////////////////////////////
// surveys
////////////////////////////
app.get('/api/surveys', surveys.findAll(data));
app.get('/api/surveys/:id', surveys.findById(data));
app.post('/api/surveys', surveys.addSurveys(data));
app.put('/api/surveys/:id', surveys.updateSurveys(data));
app.delete('/api/surveys/:id', surveys.deleteSurveys(data));

/*global.thisIsAGlobalFnc = function(res,dat)
 {
    res.send(dat);
 }*/
 
////////////////////////////
// start server
////////////////////////////
app.listen(1337, "0.0.0.0");
console.log("Express server listening on port 1337");