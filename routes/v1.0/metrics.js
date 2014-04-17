/*// mongo
var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('107.170.249.243', 15069, {auto_reconnect: true});
db = new Db('hydra', server);
db.authenticate("derek", "immersyve", function(err, res)
{
    // callback
    console.log("auth ");
});
*/ 
/*db.open
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
*/

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
exports.findById = function(data) 
{
   return function(req, res) 
    {
         var id = req.params.id;
        console.log('Retrieving metrics: ' + id);

       // get model
        var metrics = data.mongoose.MetricsModel;

        // get metric by id
        metrics.findById(id, function (err,items)
        {
           if (err) return console.error(err);
           else res.send(items); 
        });
    }
};
 
 // find all metrics
exports.findAll = function(data)
{
    return function(req, res) 
    {
        // get size of querystring (if any)
        //size = res.locals.getQuerySize();
        
        // search querystring
        var mongoQuery = res.locals.queryToMongo();

        // get model
        var metrics = data.mongoose.MetricsModel;

        // get metrics
        metrics.find(function (err,items)
        {
           if (err) return console.error(err);
           else res.send(items); 
        });
    }
};

// find all metrics
/*exports.searchMetrics = function(data) 
{
   return function(req, res) 
    {
        //var id = req.params.id;
        //var i = req.params.length;
        var searchStr = '';
        var obj = req.query;
        Object.keys(obj).forEach(function(key)
            {
                searchStr += key +" is " + req.param(key) + " "
            }
        );
        var size = 0, key;
        for (key in obj) 
        {
            if (obj.hasOwnProperty(key)) size++;
        }

        //console.log('Retrieving metrics: ' + req.body[0]);// + id);
        res.send("got it " + obj.color + " / " + obj.name + " : " + searchStr + " :: " + size);//+ size + " / " +req.body + " / " + req.query + " / " + req.params);
        /*db.collection('metrics', function(err, collection) 
        {
            // iterate
            collection.findOne(
                {
                    //'_id':new BSON.ObjectID(id)
                    searchParams
                }, 
                function(err, item) 
                {
                    res.send(item);
                }
            );
        });*//*
    }
};
*/
// add metric 
exports.addMetrics = function(data) 
{
   return function(req, res) 
    {
        var metrics = req.body;
        console.log('Adding metrics: ' + JSON.stringify(metrics));
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
        data.db.collection('metrics', function(err, collection) 
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
}

// update metric 
exports.updateMetrics = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        var metrics = req.body;
        console.log('Updating metrics: ' + id);
        console.log(JSON.stringify(metrics));
        data.db.collection('metrics', function(err, collection) 
        {
            collection.update
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
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
}
 
exports.deleteMetrics = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        console.log('Deleting metrics: ' + id);
        data.db.collection('metrics', function(err, collection) 
        {
            collection.remove
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
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
}

exports.patchMetrics = function(data) 
{
   return function(req, res) 
    {
        res.send("patching...");
        var id = req.params.id;
        var metrics = req.body;
        console.log('Updating metrics: ' + id);
        console.log(JSON.stringify(metrics));
        data.db.collection('metrics', function(err, collection) 
        {
            collection.update
            (
                {
                    '_id':new data.BSON.ObjectID(id)
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
}
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
/*var populateDB = function() 
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

    var keywordsArray = 
    [
        "keyword1",
        "keyword2",
        "keyword3"
    ];

    var logicArray = 
    [
        "logic1",
        "logic2",
        "logic3"
    ];

    var conditionsArray =
    [
        "condition1",
        "condition2"
    ];
 
    var metrics = [
    {
        name: "metric name",
        description: "metric description",
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
        keywords: keywordsArray,
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
 
};*/