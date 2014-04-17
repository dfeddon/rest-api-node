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
    console.log("auth");
});
 
db.open
(
	function(err, db)
	{
	    if(!err) 
	    {
	        console.log("Connected to 'clientsdb' database");
	        db.collection('clients', {strict:true}, function(err, collection) 
	        {
	            if (err) 
	            {
	                console.log("The 'clients' collection doesn't exist. Creating it with sample data...");
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
    var clientsSchema = new mongoose.Schema(
    {
          name: String
        , year: Number
        , grapes: String
        , country: String
        , region: String
        , description: String
        , picture: String
    });


    //var clientsModel = mongoose.model('clientsModel', clientsSchema)
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
        console.log('Retrieving clients: ' + id);
        data.db.collection('clients', function(err, collection) 
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
 
 // find all clients
exports.findAll = function(data) 
{
   return function(req, res) 
    {
        // Find all movies.
        /*var clientsModel = mongoose.model('clientsModel', clientsSchema);
        clientsModel.find(function(err, movies) {
          if (err) return console.error(err);
          console.dir(movies);
        });*/
        data.db.collection('clients', function(err, collection) 
        {
            collection.find().toArray(function(err, items) 
            {
                res.send(items);
            });
        });
    }
};

// add metric 
exports.addClients = function(data) 
{
   return function(req, res) 
    {
        var clients = req.body;
        console.log('Adding clients: ' + JSON.stringify(clients));
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
        data.db.collection('clients', function(err, collection) 
        {
            collection.insert(clients, {safe:true}, function(err, result) 
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
exports.updateClients = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        var clients = req.body;
        console.log('Updating clients: ' + id);
        console.log(JSON.stringify(clients));
        data.db.collection('clients', function(err, collection) 
        {
            collection.update
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
        		clients, 
        		{
        			safe:true
        		}, 
        		function(err, result) 
        		{
            		if (err) 
            		{
                		console.log('Error updating clients: ' + err);
                		res.send({'error':'An error has occurred'});
            		} 
            		else 
            		{
                		console.log('' + result + ' document(s) updated');
                		res.send(clients);
            		}
        		}
            );
        //);
    	});
    }
}
 
exports.deleteClients = function(req, res) 
{
    var id = req.params.id;
    console.log('Deleting clients: ' + id);
    db.collection('clients', function(err, collection) 
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

exports.patchClients = function(data) 
{
   return function(req, res) 
    {
        res.send("patching...");
        var id = req.params.id;
        var clients = req.body;
        console.log('Updating clients: ' + id);
        console.log(JSON.stringify(clients));
        data.db.collection('clients', function(err, collection) 
        {
            collection.update
            (
                {
                    '_id':new data.BSON.ObjectID(id)
                }, 
                clients, 
                {
                    safe:true
                }, 
                function(err, result) 
                {
                    if (err) 
                    {
                        console.log('Error updating clients: ' + err);
                        res.send({'error':'An error has occurred'});
                    } 
                    else 
                    {
                        console.log('' + result + ' document(s) updated');
                        res.send(clients);
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
    var metricsArray =
    [
        "53444aaffd7742ad0f161053",
        "53444aa960a997ab0ffd3829"
    ];
 
     var metricGroupsArray =
    [
        "534453282fc0a31b10d0cc2f",
        "53444aa960a997ab0ffd3829"
    ];

    var clients = [
    {
        name: "client1",
        description: "my very new client description.",
        status: "active",
        metrics: metricsArray,
        metricGroups: metricGroupsArray
    }];
 
    db.collection('clients', function(err, collection) 
    {
        collection.insert(clients, 
        	{
        		safe:true
        	}, 
        	function(err, result) {}
        );
    });
 
};*/