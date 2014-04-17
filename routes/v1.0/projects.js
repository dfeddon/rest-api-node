// mongo
var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('107.170.249.243', 15069, {auto_reconnect: true});
db = new Db('metricsdb', server);
db.authenticate("derek", "immersyve", function(err, res)
{
    // callback
    console.log("auth ");
});
 
db.open
(
	function(err, db) 
	{
	    if(!err) 
	    {
	        console.log("Connected to 'metricsdb' database");
	        db.collection('metrics', {strict:true}, function(err, collection) 
	        {
	            if (err) 
	            {
	                console.log("The 'metrics' collection doesn't exist. Creating it with sample data...");
	                populateDB();
	            }
                else
                {
                    //populateDB();
                }
	        });
	    }
	}
);


///////////////////
// mongoose
///////////////////
/*process.stdout.write("connecting to mongoose...");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback()
{
	// success!
    process.stdout.write("success mongoose... ");
    var metricsSchema = new mongoose.Schema(
    {
          name: String
        , year: Number
        , grapes: String
        , country: String
        , region: String
        , description: String
        , picture: String
    });


    //var metricsModel = mongoose.model('metricsModel', metricsSchema)
});*/


///////////////////
// api's 
///////////////////

// find metric by id
exports.findById = function(req, res) 
{
    var id = req.params.id;
    console.log('Retrieving metrics: ' + id);
    db.collection('metrics', function(err, collection) 
    {
        collection.findOne(
        	{
        		'_id':new BSON.ObjectID(id)
        	}, 
        	function(err, item) 
        	{
            	res.send(item);
        	}
        );
    });
};
 
 // find all metrics
exports.findAll = function(req, res) 
{
    // Find all movies.
    /*var metricsModel = mongoose.model('metricsModel', metricsSchema);
    metricsModel.find(function(err, movies) {
      if (err) return console.error(err);
      console.dir(movies);
    });*/
    db.collection('metrics', function(err, collection) 
    {
        collection.find().toArray(function(err, items) 
        {
            res.send(items);
        });
    });
};

// add metric 
exports.addmetrics = function(req, res) 
{
    var metrics = req.body;
    console.log('Adding metrics: ' + JSON.stringify(metrics));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
    db.collection('metrics', function(err, collection) 
    {
        collection.insert(metrics, {safe:true}, function(err, result) 
        {
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            } else 
            {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

// update metric 
exports.updatemetrics = function(req, res) 
{
    var id = req.params.id;
    var metrics = req.body;
    console.log('Updating metrics: ' + id);
    console.log(JSON.stringify(metrics));
    db.collection('metrics', function(err, collection) 
    {
        collection.update
        (
        	{
        		'_id':new BSON.ObjectID(id)
        	}, 
    		metrics, 
    		{
    			safe:true
    		}, 
    		function(err, result) 
    		{
        		if (err) 
        		{
            		console.log('Error updating metrics: ' + err);
            		res.send({'error':'An error has occurred'});
        		} 
        		else 
        		{
            		console.log('' + result + ' document(s) updated');
            		res.send(metrics);
        		}
    		}
        );
    //);
	});
}
 
exports.deletemetrics = function(req, res) 
{
    var id = req.params.id;
    console.log('Deleting metrics: ' + id);
    db.collection('metrics', function(err, collection) 
    {
        collection.remove
        (
        	{
        		'_id':new BSON.ObjectID(id)
        	}, 
        	{
        		safe:true
        	}, 
        	function(err, result) 
        	{
	            if (err) 
	            {
	                res.send({'error':'An error has occurred - ' + err});
	            } else 
	            {
	                console.log('' + result + ' document(s) deleted');
	                res.send(req.body);
	            }
        	}
        );
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() 
{
    var itemsArray = 
    [
        {
            value:          2,
            reverse:        false,
            required:       false,
            leftAnchor:     false,
            rightAnchor:    false,
            reponse:        false
        }
    ];

    var keywordArray = 
    [
        {
            1:"keyword1",
            2:"keyword2",
            3:"keyword3"
        }
    ];

    var logicArray = 
    [
        {
            1:"logic1",
            2:"logic2",
            3:"logic3"
        }
    ];

    var conditionsArray =
    [
        {
            1:"condition1",
            2:"condition2"
        }
    ];
 
    var metrics = [
    {
        isImmersyve: true,
        variable: "myvar1",
        required: true,
        stem: "This is the stem.",
        randomize: false,
        reverse: false,
        remove: 0,
        selected: 0,
        randomizeItems: 0,
        requireAll: false,
        visible: true,
        keyword: keywordArray,
        instructions: "This is the instructions field",
        response: "repsonse1",
        pipedId: 0,
        logic: logicArray,
        type: 1,
        items: itemsArray,
        conditions: conditionsArray,
        layout: 1
    },
    {
        isImmersyve: true,
        variable: "myvar1",
        required: true,
        stem: "This is the stem.",
        randomize: false,
        reverse: false,
        remove: 0,
        selected: 0,
        randomizeItems: 0,
        requireAll: false,
        visible: true,
        keyword: keywordArray,
        instructions: "This is the instructions field",
        response: "repsonse1",
        pipedId: 0,
        logic: logicArray,
        type: 1,
        items: itemsArray,
        conditions: conditionsArray,
        layout: 1
    }];
 
    db.collection('metrics', function(err, collection) 
    {
        collection.insert(metrics, 
        	{
        		safe:true
        	}, 
        	function(err, result) {}
        );
    });
 
};