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
	        console.log("Connected to 'metricgroupsdb' database");
	        db.collection('metricgroups', {strict:true}, function(err, collection) 
	        {
	            if (err) 
	            {
	                console.log("The 'metricgroups' collection doesn't exist. Creating it with sample data...");
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
    var metricgroupsSchema = new mongoose.Schema(
    {
          name: String
        , year: Number
        , grapes: String
        , country: String
        , region: String
        , description: String
        , picture: String
    });


    //var metricgroupsModel = mongoose.model('metricgroupsModel', metricgroupsSchema)
});*/


///////////////////
// api's 
///////////////////

// find metric by id
exports.findById = function(data) 
{
   return function(req, res) 
    {
        var async = require("async");
        var items, metrics;
        var id = req.params.id;
        console.log('Retrieving metricgroups: ' + id);
        data.db.collection('metricgroups', function(err, collection) 
        {
            collection.findOne(
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
            	function(err, item) 
            	{
                    for (key in item)
                    {
                        if (item.hasOwnProperty(key))
                        {
                            console.log(key + ':' + item[key])
                        }
                        if (key == "metrics")
                        {
                            ckey = key;
                            if (item[key])
                            {
                                total=item[key].length;
                                count=0;
                                async.forEach(item[key], getMetrics, sendResults);

                                function getMetrics(task, callback)
                                {
                                    /*var hi = res.locals.getById('metrics', task)//, function(err,res)
                                    {
                                        console.log(hi);
                                        count++;
                                        console.log("count "+count);
                                    }*/
                                    newkey = [];
                                    data.db.collection("metrics", function(err, collection) 
                                    {
                                        collection.findOne(
                                          {
                                            '_id':new data.BSON.ObjectID(task)
                                          }, 
                                          function(err, item) 
                                          {
                                            if (err) console.log("ERROR " + err);
                                            //console.log("item = "+item.name);
                                            newkey.push(item);
                                            //return item;
                                            count++;
                                            console.log(count+"/"+total+item);
                                            if (count == total)
                                            {
                                                //item[key] = newkey;
                                                console.log('*'+ckey);
                                                //res.send(item);
                                                callback(newkey);
                                            }
                                          }
                                        );
                                    });

                                }

                                function sendResults(iitem)
                                {
                                    //console.log("mkey "+mkey)
                                    item['metrics']=iitem;
                                    console.log(item);
                                    res.send(item);
                                }
                            }
                        }
                    }
                    //items = item;
                	//res.send(item);
            	}
            );
        });
    }
};
 
 // find all metricgroups
exports.findAll = function(data) 
{
   return function(req, res) 
    {
        // Find all movies.
        /*var metricgroupsModel = mongoose.model('metricgroupsModel', metricgroupsSchema);
        metricgroupsModel.find(function(err, movies) {
          if (err) return console.error(err);
          console.dir(movies);
        });*/
        data.db.collection('metricgroups', function(err, collection) 
        {
            collection.find().toArray(function(err, items) 
            {
                /*for (var i=0; i < items.length; i++)
                {

                }*/    
                res.send(items);
                //res.locals.resall(items);
            });
        });
    }
};

// add metric 
exports.addMetricgroups = function(data) 
{
   return function(req, res) 
    {
        var metricgroups = req.body;
        console.log('Adding metricgroups: ' + JSON.stringify(metricgroups));
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
        data.db.collection('metricgroups', function(err, collection) 
        {
            collection.insert(metricgroups, {safe:true}, function(err, result) 
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
exports.updateMetricgroups = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        var metricgroups = req.body;
        console.log('Updating metricgroups: ' + id);
        console.log(JSON.stringify(metricgroups));
        data.db.collection('metricgroups', function(err, collection) 
        {
            collection.update
            (
            	{
            		'_id':new data.BSON.ObjectID(id)
            	}, 
        		metricgroups, 
        		{
        			safe:true
        		}, 
        		function(err, result) 
        		{
            		if (err) 
            		{
                		console.log('Error updating metricgroups: ' + err);
                		res.send({'error':'An error has occurred'});
            		} 
            		else 
            		{
                		console.log('' + result + ' document(s) updated');
                		res.send(metricgroups);
            		}
        		}
            );
        //);
    	});
    }
}
 
exports.deleteMetricgroups = function(data) 
{
   return function(req, res) 
    {
        var id = req.params.id;
        console.log('Deleting metricgroups: ' + id);
        data.db.collection('metricgroups', function(err, collection) 
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

exports.patchMetricgroups = function(data) 
{
   return function(req, res) 
    {
        res.send("patching...");
        var id = req.params.id;
        var metricgroups = req.body;
        console.log('Updating metricgroups: ' + id);
        console.log(JSON.stringify(metricgroups));
        data.db.collection('metricgroups', function(err, collection) 
        {
            collection.update
            (
                {
                    '_id':new data.BSON.ObjectID(id)
                }, 
                metricgroups, 
                {
                    safe:true
                }, 
                function(err, result) 
                {
                    if (err) 
                    {
                        console.log('Error updating metricgroups: ' + err);
                        res.send({'error':'An error has occurred'});
                    } 
                    else 
                    {
                        console.log('' + result + ' document(s) updated');
                        res.send(metricgroups);
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
 
    var metricgroups = [
    {
        name: "metricgroup1",
        description: "my very new metric group description.",
        isImmersyve: true,
        metrics: metricsArray
    }];
 
    db.collection('metricgroups', function(err, collection) 
    {
        collection.insert(metricgroups, 
        	{
        		safe:true
        	}, 
        	function(err, result) {}
        );
    });
 
};*/