// mongo
/*var mongo = require('mongodb');
 
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
 
db.open
(
	function(err, db) 
	{
	    if(!err) 
	    {
	        console.log("Connected to 'pagesdb' database");
	        db.collection('pages', {strict:true}, function(err, collection) 
	        {
	            if (err) 
	            {
	                console.log("The 'pages' collection doesn't exist. Creating it with sample data...");
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
    var pagesSchema = new mongoose.Schema(
    {
          name: String
        , year: Number
        , grapes: String
        , country: String
        , region: String
        , description: String
        , picture: String
    });


    //var pagesModel = mongoose.model('pagesModel', pagesSchema)
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
        console.log('Retrieving pages: ' + id);
        data.db.collection('pages', function(err, collection) 
        {
            collection.findOne(
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
            	function(err, item) 
            	{
                	res.send(item);
            	}
            );
        });
    }
};
 
 // find all pages
exports.findAll = function(data) 
{
   return function(req, res) 
    {
        // Find all movies.
        /*var pagesModel = mongoose.model('pagesModel', pagesSchema);
        pagesModel.find(function(err, movies) {
          if (err) return console.error(err);
          console.dir(movies);
        });*/
        data.db.collection('pages', function(err, collection) 
        {
            collection.find().toArray(function(err, items) 
            {
                res.send(items);
            });
        });
    }
};

// add metric 
exports.addPages = function(data) 
{
    return function(req, res) 
    {
        var pages = req.body;
        console.log('Adding pages: ' + JSON.stringify(pages));
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
        data.db.collection('pages', function(err, collection) 
        {
            collection.insert(pages, {safe:true}, function(err, result) 
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
exports.updatePages = function(data) 
{
    return function(req, res) 
    {
        var id = req.params.id;
        var pages = req.body;
        console.log('Updating pages: ' + id);
        console.log(JSON.stringify(pages));
        data.db.collection('pages', function(err, collection) 
        {
            collection.update
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
        		pages, 
        		{
        			safe:true
        		}, 
        		function(err, result) 
        		{
            		if (err) 
            		{
                		console.log('Error updating pages: ' + err);
                		res.send({'error':'An error has occurred'});
            		} 
            		else 
            		{
                		console.log('' + result + ' document(s) updated');
                		res.send(pages);
            		}
        		}
            );
        //);
    	});
    }
}
 
exports.deletePages = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        console.log('Deleting pages: ' + id);
        data.db.collection('pages', function(err, collection) 
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
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
/*var populateDB = function() 
{
    var logicArray = 
    [
            "logic1",
            "logic2",
            "logic3"
    ];

    var metricsArray =
    [
        "5339c1a3a0a985c40eedaea5",
        "5339c1a3a0a985c40eedaea6"
    ];
 
    var pages = 
    [
        {
            title: true,
            description: "myvar1",
            visible: 1,
            index: 1,
            metrics: metricsArray,
            logic: logicArray
        }
    ];
 
    db.collection('pages', function(err, collection) 
    {
        collection.insert(pages, 
        	{
        		safe:true
        	}, 
        	function(err, result) {}
        );
    });
 
};*/