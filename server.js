////////////////////////////
// express
////////////////////////////

var express       = require('express')
  , async         = require('async')
  , mongoose      = require('./v1.0/model/index')//.initialize()
  , globals       = require('./v1.0/routes/globals')
  , passport      = require('passport')
  , oauth2        = require('./v1.0/oauth2/oauth2')
  , config        = require('./v1.0/libs/config')

// start express
var app = express();

// disable x-powered-by Express
app.disable('x-powered-by');

////////////////////////////
// local scope helpers
////////////////////////////
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
    console.log("query2mongo");
    console.log(req.query);
    Object.keys(req.query).forEach(function(key)
    {
      val = req.param(key);

      // value type conversions
      if (val == "true") val = true;
      if (val == "false") val = false;
      if (val === parseInt(val)) val = parseInt(val);

      // build Mongo query object
      query[key] = val;
      console.log(query[key], val);
    });
    console.log('query');
    console.log(query);
    return query;
  }

  // build item properties
  res.locals.buildItem=function(model)
  {
    var item = req.body;

    // compress array of objects to array of objectId's
    // var casted = item.pages.map(function( page ) 
    // {
    //   return mongoose.Types.ObjectId(page);
    // });
    //
    //var readyItem = model.preSave(item);
    for (var name in item)
    {
        console.log(name + " / " + item[name], name);
        if (model.schema.paths.hasOwnProperty(name))
        {
            //console.log("VALID!");
            model[name] = item[name];
        }
        else // might be a virtual property
        {
            console.log("INVALID property", name, item[name]);
            console.log("checking for virtual");
            // append data IF property is a 'virtual'
            if (model.schema.virtuals.hasOwnProperty([name]))
            {
              console.log("IS a virtual, so adding it!");
              model[name] = item[name];
            }

        }
    }
    return model;
  }

  // find item by id
  res.locals.getById=function(coll, id)
  {
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

  res.locals.getClient=function(callback)
  {
    console.log("getting client");
    console.log(req.user);
    //console.log(oauth2.token);

    mongoose.AccessToken
    .findOne({'userId':req.user._id})
    .exec (function(err, item)
    {
      if (err)
      {
        console.log(err);
      }
      else 
      {
        console.log("item");
        console.log(item);
        callback(item);
      }
    });
    //return res.passport;//.clientId;
  }

  // res.locals.middleAuth=function(fnc)
  // {
  //   if (!fnc)
  //     fnc = middleware.yesAuth;
  //   return middleware.middleAuth;
  // }

  // generate a GUID
  res.locals.createGUID=function()
  {
    // http://guid.us/GUID/JavaScript
    function S4() 
    {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    }
     
    // then to call it, plus stitch in '4' in the third group
    guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    //alert(guid);
    return guid;
  }

  // console logging
  console.log('%s %s', req.method, req.url);

  // required
  next();
});

////////////////////////////
// CORS middleware
////////////////////////////
var allowedDomains = "*";// test.com anotherdomain.com"; // or || delimiter
var allowCrossDomain = function(req, res, next) 
{
    res.header('Access-Control-Allow-Origin', allowedDomains);//config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    //console.log(req.client);
    next();
}
 
app.configure(function()
{
    app.use(express.favicon()); // use standard favicon
    app.use(express.logger('dev')); // log all requests : 'default', 'short', 'tiny', 'dev'
    //app.use(express.bodyParser()); // json parsing (deprecated)
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride()); // HTTP PUT and DELETE support
    app.use(allowCrossDomain); // CORS middleware
    app.use(passport.initialize());
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
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
 });

app.get('/', function(req, res)
{
  res.send(req.query);
});

// app.get('/api/*', function(req, res)
// {
//   console.log("middling");
//   passport.authenticate('bearer', { session: false });
//   //console.log(req);
//   res.send(req.query);
// });

////////////////////////////
// global middlewares
////////////////////////////
// token authentication (closures)
// set method to app.locals
// app.locals(
// {
//     noAuth:function(req, res, next){next();},
//     yesAuth: passport.authenticate('bearer', { session: false}),
//     middleAuth: app.locals.yesAuth
// });
//globals.middleAuth = globals.yesAuth;
// var middleware = 
// {
//   noAuth: function(req, res, next){next();},
//   yesAuth: passport.authenticate('bearer', { session: false}),
//   middleAuth: this.yesAuth
// }
// app.set('noAuth', function(req, res, next){next();});
// app.set('yesAuth', passport.authenticate('bearer', { session: false}));
// app.set('middleAuth', app.get('yesAuth'));
// evalute client
var yesAuth = passport.authenticate('bearer', { session: false});
app.get('/api/*', yesAuth);//app.get('middleAuth'));//passport.authenticate('bearer', { session: false }) );
app.put('/api/*', yesAuth);//app.get('middleAuth'));
app.post('/api/*', yesAuth);//app.get('middleAuth'));
app.delete('/api/*', yesAuth);//app.get('middleAuth'));

// permissioning
//app.get('api/*', globals.permissioning);

////////////////////////////
// oauth2 (token authentication)
////////////////////////////
require('./v1.0/oauth2/auth');

app.post('/oauth2/token', oauth2.token, function(req, res){});
// app.post('/client', function(req, res, next)
//   {
//     if (req.body.client_id)
//     {
//       switch(req.body.client_id)
//       {
//         case "insight_player":

//         console.log("we have insight");
//         var disableAuth = app.get('noAuth');
//         app.set('middleAuth', disableAuth);//disableAuth);//app.get('noAuth'));
//         app.use(function(req, res, next){next();})

//         break;
//       }
//     }
//     console.log('derek ' + req.method + ' / ' + req.body.client_id);
//     next();
//   });

////////////////////////////
// metrics
////////////////////////////
var metricsData =
{
  "model":mongoose.Metrics,
  "populate":"metricLogic.logicSets.logicItems.metric"//userPermissions items conditions",
  //"linkedModels":[mongoose.permissionsModel,mongoose.metricItemsModel]
};

app.get('/api/metrics', globals.permissioning(metricsData),
  globals.findAll(metricsData));
app.get('/api/metrics/:id', globals.permissioning(metricsData),
  globals.findById(metricsData));
app.post('/api/metrics', 
  globals.addItems(mongoose.Metrics));
app.put('/api/metrics/:id', 
  globals.updateItems(mongoose.Metrics));
app.delete('/api/metrics/:id', 
  globals.deleteItems(mongoose.Metrics));
// batch post
app.post('/api/metrics/batch', 
   globals.addBatchItems(mongoose.Metrics));
// deep copy
app.put('/api/metrics/copy/:id',
  globals.copyItem(metricsData));
// public api's
//app.get('/public/metrics', globals.findAll(metricsData));
//app.get('/public/metrics/:id', globals.findById(metricsData));

////////////////////////////
// metricgroups
////////////////////////////
var metricGroupsData =
{
  "model":mongoose.MetricGroups,
  "populate":"metrics"
};

app.get('/api/metricgroups', 
  globals.findAll(metricGroupsData));
app.get('/api/metricgroups/:id', 
  globals.findById(metricGroupsData));
app.post('/api/metricgroups', 
  globals.addItems(mongoose.MetricGroups));
app.put('/api/metricgroups/:id', 
  globals.updateItems(mongoose.MetricGroups));
app.delete('/api/metricgroups/:id', 
  globals.deleteItems(mongoose.MetricGroups));

////////////////////////////
// pages
////////////////////////////
var pagesData =
{
  "model":mongoose.Pages,
  "populate":"metrics"
};
app.get('/api/pages', 
  globals.findAll(pagesData));
app.get('/api/pages/:id', 
  globals.findById(pagesData));
app.post('/api/pages', 
  globals.addItems(mongoose.Pages));
app.put('/api/pages/:id', 
  globals.updateItems(mongoose.Pages));
app.delete('/api/pages/:id', 
  globals.deleteItems(mongoose.Pages));
// deep copy
app.put('/api/pages/copy/:id',
  globals.copyItem(pagesData));

////////////////////////////
// surveys
////////////////////////////
var surveysData =
{
  "model":mongoose.Surveys,
  "populate":"pages"
};
app.get('/api/surveys', 
  globals.findAll(surveysData));
app.get('/api/surveys/:id', 
  globals.findById(surveysData));
app.post('/api/surveys', 
  globals.addItems(mongoose.Surveys));
app.put('/api/surveys/:id', 
  globals.updateItems(mongoose.Surveys));
app.delete('/api/surveys/:id', 
  globals.deleteItems(mongoose.Surveys));
// deep copy
app.put('/api/surveys/copy/:id',
  globals.copyItem(surveysData));

////////////////////////////
// organizations
////////////////////////////
var organizationsData =
{
  "model":mongoose.Organizations,
  "populate":"admin metrics metricGroups"
};

app.get('/api/organizations', 
  globals.findAll(organizationsData));
app.get('/api/organizations/:id', 
  globals.findById(organizationsData));
app.post('/api/organizations', 
  globals.addItems(mongoose.Organizations));
app.put('/api/organizations/:id', 
  globals.updateItems(mongoose.Organizations));
app.delete('/api/organizations/:id', 
  globals.deleteItems(mongoose.Organizations));

////////////////////////////
// users
////////////////////////////
var usersData =
{
  "model":mongoose.Users,
  "populate":""
};

app.get('/api/users', 
  globals.findAll(usersData));
app.get('/api/users/:id', 
  globals.findById(usersData));
app.post('/api/users', 
  globals.addItems(mongoose.Users));
app.put('/api/users/:id', 
  globals.updateItems(mongoose.Users));
app.delete('/api/users/:id',
  globals.deleteItems(mongoose.Users));

////////////////////////////
// projects
////////////////////////////
var projectsData =
{
  "model":mongoose.Projects,
  "populate":"products"
};

app.get('/api/projects', 
  globals.findAll(projectsData));
app.get('/api/projects/:id', 
  globals.findById(projectsData));
app.post('/api/projects', 
  globals.addItems(mongoose.Projects));
app.put('/api/projects/:id', 
  globals.updateItems(mongoose.Projects));
app.delete('/api/projects/:id', 
  globals.deleteItems(mongoose.Projects));

////////////////////////////
// products
////////////////////////////
var productsData =
{
  "model":mongoose.Products,
  "populate":"iterations"
};

app.get('/api/products', 
  globals.findAll(productsData));
app.get('/api/products/:id', 
  globals.findById(productsData));
app.post('/api/products', 
  globals.addItems(mongoose.Products));
app.put('/api/products/:id', 
  globals.updateItems(mongoose.Products));
app.delete('/api/products/:id', 
  globals.deleteItems(mongoose.Products));

////////////////////////////
// iterations
////////////////////////////
var iterationsData =
{
  "model":mongoose.Iterations,
  "populate":"studies"
};

app.get('/api/iterations', 
  globals.findAll(iterationsData));
app.get('/api/iterations/:id', 
  globals.findById(iterationsData));
app.post('/api/iterations', 
  globals.addItems(mongoose.Iterations));
app.put('/api/iterations/:id', 
  globals.updateItems(mongoose.Iterations));
app.delete('/api/iterations/:id', 
  globals.deleteItems(mongoose.Iterations));

////////////////////////////
// studies
////////////////////////////
var studiesData =
{
  "model":mongoose.Studies,
  "populate":"surveys"
};

app.get('/api/studies', 
  globals.findAll(studiesData));
app.get('/api/studies/:id', 
  globals.findById(studiesData));
app.post('/api/studies', 
  globals.addItems(mongoose.Studies));
app.put('/api/studies/:id', 
  globals.updateItems(mongoose.Studies));
app.delete('/api/studies/:id', 
  globals.deleteItems(mongoose.Studies));
// deep copy
app.put('/api/studies/copy/:id',
  globals.copyItem(studiesData));

////////////////////////////
// triggers
////////////////////////////
var triggersData =
{
  "model":mongoose.Triggers,
  "populate":"admin metrics metricGroups"
};

app.get('/api/triggers', 
  globals.findAll(triggersData));
app.get('/api/triggers/:id', 
  globals.findById(triggersData));
app.post('/api/triggers', 
  globals.addItems(mongoose.Triggers));
app.put('/api/triggers/:id', 
  globals.updateItems(mongoose.Triggers));
app.delete('/api/triggers/:id', 
  globals.deleteItems(mongoose.Triggers));

////////////////////////////
// libraryGroups
////////////////////////////
var libraryGroupsData =
{
  "model":mongoose.LibraryGroups,
  "populate":"metrics pages"
};

app.get('/api/libraryGroups', 
  globals.findAll(libraryGroupsData));
app.get('/api/libraryGroups/:id', 
  globals.findById(libraryGroupsData));
app.post('/api/libraryGroups', 
  globals.addItems(mongoose.LibraryGroups));
app.put('/api/libraryGroups/:id', 
  globals.updateItems(mongoose.LibraryGroups));
app.delete('/api/libraryGroups/:id', 
  globals.deleteItems(mongoose.LibraryGroups));

////////////////////////////
// libraryFolders
////////////////////////////
var libraryFoldersData =
{
  "model":mongoose.LibraryFolders,
  "populate":"metrics pages libraryGroups"
};

app.get('/api/libraryFolders', 
  globals.findAll(libraryFoldersData));
app.get('/api/libraryFolders/:id', 
  globals.findById(libraryFoldersData));
app.post('/api/libraryFolders', 
  globals.addItems(mongoose.LibraryFolders));
app.put('/api/libraryFolders/:id', 
  globals.updateItems(mongoose.LibraryFolders));
app.delete('/api/libraryFolders/:id', 
  globals.deleteItems(mongoose.LibraryFolders));

////////////////////////////
// sessions
////////////////////////////
var sessionsData =
{
  "model":mongoose.Sessions,
  "populate":"user study survey lastPage"
};

app.get('/api/sessions', 
  globals.findAll(sessionsData));
app.get('/api/sessions/:id', 
  globals.findById(sessionsData));
app.post('/api/sessions', 
  globals.addItems(mongoose.Sessions));
app.put('/api/sessions/:id', 
  globals.updateItems(mongoose.Sessions));
app.delete('/api/sessions/:id', 
  globals.deleteItems(mongoose.Sessions));

////////////////////////////
// constructs
////////////////////////////
var constructsData =
{
  "model":mongoose.Constructs,
  "populate":""
};

app.get('/api/constructs', 
  globals.findAll(constructsData));
app.get('/api/constructs/:id', 
  globals.findById(constructsData));
app.post('/api/constructs', 
  globals.addItems(mongoose.Constructs));
app.put('/api/constructs/:id', 
  globals.updateItems(mongoose.Constructs));
app.delete('/api/constructs/:id', 
  globals.deleteItems(mongoose.Constructs));

////////////////////////////
// presets
////////////////////////////
var presetsData =
{
  "model":mongoose.Presets,
  "populate":""
};

app.get('/api/presets', 
  globals.findAll(presetsData));
app.get('/api/presets/:id', 
  globals.findById(presetsData));
app.post('/api/presets', 
  globals.addItems(mongoose.Presets));
app.put('/api/presets/:id', 
  globals.updateItems(mongoose.Presets));
app.delete('/api/presets/:id', 
  globals.deleteItems(mongoose.Presets));

////////////////////////////
// metricResponses
////////////////////////////
var responseData =
{
  "model":mongoose.MetricResponses,
  "populate":""//session study survey page metric"
};

app.get('/api/response', 
  globals.findAll(responseData));
app.get('/api/response/:id', 
  globals.findById(responseData));
app.post('/api/response', 
  globals.addItems(mongoose.MetricResponses));
app.put('/api/response/:id', 
  globals.updateItems(mongoose.MetricResponses));
app.delete('/api/response/:id', 
  globals.deleteItems(mongoose.MetricResponses));
// batch post
app.post('/api/responses', 
  globals.addBatchItems(mongoose.MetricResponses));

////////////////////////////
// export
////////////////////////////
var exportData =
{
  "model":mongoose.MetricResponses,
  "populate":""//session study survey page metric"
};

app.get('/api/export/:id', 
  globals.exportSurvey(exportData));
// app.get('/api/response/:id', 
//   globals.findById(exportData));
// app.post('/api/response', 
//   globals.addItems(mongoose.MetricResponses));
// app.put('/api/response/:id', 
//   globals.updateItems(mongoose.MetricResponses));
// app.delete('/api/response/:id', 
//   globals.deleteItems(mongoose.MetricResponses));
// // batch post
// app.post('/api/responses', 
//   globals.addBatchItems(mongoose.MetricResponses));




// isAuthenticated
function isAuthenticated(req, res, next)
{
  passport.authenticate('bearer', { session: false });
  console.log('result '+req.user);//());
  return next();
}

/*global.thisIsAGlobalFnc = function(res,dat)
 {
    res.send(dat);
 }*/
 
////////////////////////////
// start server
////////////////////////////
app.listen(config.get('port'), "0.0.0.0");
console.log("Express server listening on port 1337");