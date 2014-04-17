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
	        console.log("Connected to 'surveysdb' database");
	        db.collection('surveys', {strict:true}, function(err, collection) 
	        {
	            if (err) 
	            {
	                console.log("The 'surveys' collection doesn't exist. Creating it with sample data...");
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
    var surveysSchema = new mongoose.Schema(
    {
          name: String
        , year: Number
        , grapes: String
        , country: String
        , region: String
        , description: String
        , picture: String
    });


    //var surveysModel = mongoose.model('surveysModel', surveysSchema)
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
        console.log('Retrieving surveys: ' + id);
        data.db.collection('surveys', function(err, collection) 
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
 
 // find all surveys
exports.findAll = function(data) 
{
   return function(req, res) 
    {
        // Find all movies.
        /*var surveysModel = mongoose.model('surveysModel', surveysSchema);
        surveysModel.find(function(err, movies) {
          if (err) return console.error(err);
          console.dir(movies);
        });*/
        data.db.collection('surveys', function(err, collection) 
        {
            collection.find().toArray(function(err, items) 
            {
                res.send(items);
            });
        });
    }
};

// add metric 
exports.addSurveys = function(data) 
{
   return function(req, res) 
    {
        var surveys = req.body;
        console.log('Adding surveys: ' + JSON.stringify(surveys));
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
        data.db.collection('surveys', function(err, collection) 
        {
            collection.insert(surveys, {safe:true}, function(err, result) 
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
exports.updateSurveys = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        var surveys = req.body;
        console.log('Updating surveys: ' + id);
        console.log(JSON.stringify(surveys));
        data.db.collection('surveys', function(err, collection) 
        {
            collection.update
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
        		surveys, 
        		{
        			safe:true
        		}, 
        		function(err, result) 
        		{
            		if (err) 
            		{
                		console.log('Error updating surveys: ' + err);
                		res.send({'error':'An error has occurred'});
            		} 
            		else 
            		{
                		console.log('' + result + ' document(s) updated');
                		res.send(surveys);
            		}
        		}
            );
        //);
    	});
    }
}
 
exports.deleteSurveys = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        console.log('Deleting surveys: ' + id);
        data.db.collection('surveys', function(err, collection) 
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
    var pagesArray = 
    [
        "533daaefea74717042aaabd5",
        "533daaefea74717042aaabd6",
        "533daaefea74717042aaabd7"
    ];

    var keywordsArray = 
    [
        "keyword1",
        "keyword2",
        "keyword3"
    ];

    var surveys = [
    {
        title: true,
        description: "myvar1",
        status: true,
        pages: pagesArray,
        minimumRequired: 75,
        flagResponse: 3,
        respondents: 50,
        keywords: keywordsArray
    }];
 
    db.collection('surveys', function(err, collection) 
    {
        collection.insert(surveys, 
        	{
        		safe:true
        	}, 
        	function(err, result) {}
        );
    });
 
};*/