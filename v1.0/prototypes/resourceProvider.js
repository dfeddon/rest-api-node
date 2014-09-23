
var ResourceProvider = function(){}

///////////////////
// constants
///////////////////
var ERROR_RESOURCE_NOT_FOUND = 'Error: Requested resource {:id} not found';
var mongoose = require('mongoose');


///////////////////
// api's 
///////////////////

// find metric by id
ResourceProvider.prototype.objectsToIds = function(item, req, callback) 
{
    console.log("\nwe have populates!");
    // get available populates
    var populates = item.getPopulates().split(" ");
    // next, determine which populates are in req.body
    for (var i = 0; i < populates.length; i++) 
    {
        //console.log("\npopulate->"+populates[i]);
        for (var prop in req.body)
        {
            console.log("\npop="+populates[i]+"/"+prop);
            if (prop == populates[i])
            {
                //console.log("\nwe have an object");
                // clear item's property
                while(item[prop].length > 0) 
                {
                    item[prop].pop();
                }
                for (var bodyItem in req.body[prop])
                {
                    // store item in var
                    var citem = req.body[prop][bodyItem];
                    // validate that populates in req.body are objects (_id)
                    if (citem._id)
                    {
                        // convert id to string
                        citemStr = String(citem._id);
                        // validate id
                        if (citemStr.match(/^[0-9a-fA-F]{24}$/))
                            item[prop].push(mongoose.Types.ObjectId(citemStr));
                        else console.log("error: invalid id");
                        //item[prop].push(citem._id);
                    }
                    else // not an object, likely id string
                    { 
                        console.log("not an object, assumption is id's were passed instead");
                        // validate that item is an mongo id, if so, cast it
                        if (citem.match(/^[0-9a-fA-F]{24}$/))
                            item[prop].push(mongoose.Types.ObjectId(citem));
                        else console.log("error: item is not an object or an id!");
                    }
                }
            }
            else // standard property
            {
                var match = false;
                for (var i2 = 0; i2 < populates.length; i2++)
                {
                    if (populates[i2] == prop)
                        match = true;
                }
                if (match != true)
                {
                    // omit versioning
                    if (prop != "__v")
                    {
                        item[prop] = req.body[prop];
                    }
                }
            }
        }
    }
    console.log("\n==="+JSON.stringify(item));
    return item;
}

///////////////////
// api's 
///////////////////

// find metric by id
ResourceProvider.prototype.findById = function(data, req, res, callback) 
{
    var id = req.params.id;

    data['model']
    .findById(id)
    .populate(data['populate'])//'userPermissions')
    .exec (function(err, item)
    {
       if (err) 
       	callback(err);
       else callback(item);
    });
};
 
 // find all metrics
ResourceProvider.prototype.findAll = function(data, req, res, callback)
{
    // get size of querystring (if any)
    //size = res.locals.getQuerySize();

    //console.log('req: ' + JSON.stringify(req));
    
    // search querystring
    var query = res.locals.queryToMongo();

    // implement permissioning (in query)

    // get all items
    data['model']
    .find(query)
    .populate(data['populate'])
    .exec (function (err,items)
    {
       	if (err)
       		return callback(err);
       	else callback(items);
    });
};

// add metric 
ResourceProvider.prototype.addItem = function(model, req, res, next, callback) 
{
    // get request item
    var item = req.body;
    console.log('item: ' + JSON.stringify(item));

   // create an instance of model
    model = new model();

    if (typeof(model.getPopulates) === "function")
    {
        this.objectsToIds(model, req, function(results)
        {
            model = results;
        });
    }
    else 
    {
        // populate model with request item properies
        model = res.locals.buildItem(model);
    }

    console.log('Adding item: ' + JSON.stringify(model));
    model.save(function(err)
    {
        if (err)
            callback(err);
        else callback(model);
    });
    //next();
}

// add metric (batch) 
ResourceProvider.prototype.addBatchItems = function(model, req, res, next, callback) 
{
    // get request item
    var items = req.body.pages; // stub -> remove .items
    console.log('batch items: ' + JSON.stringify(items));
    //console.log('pages '+items.pages);
    if (!(items instanceof Array))
    {
        console.log("body is NOT an array");
    }
    for (var item in items)
    {
        console.log("\n* " + JSON.stringify(items[item]));
        // create an instance of model
        model = new model();

        if (typeof(model.getPopulates) === "function")
        {
            // ISSUE: req can handle only single items, not an array of items
            // FIX: send "item" here, "req.body" elsewhere
            this.objectsToIds(model, req, function(results)
            {
                model = results;
            });
        }
        else 
        {
            // ISSUE: req.body in buildItem fnc can handle only single items, not an array of items
            // populate model with request item properies
            // FIX: send "item" with model here, "req.body" with model elsewhere
            model = res.locals.buildItem(model);
        }

        console.log('Adding item: ' + JSON.stringify(model));
        model.save(function(err)
        {
            if (err)
                callback(err);
            else console.log("save success!");//callback(model);
        });
    }

    callback(items);return;
    // // create an instance of model
    // model = new model();

    // if (typeof(model.getPopulates) === "function")
    // {
    //     this.objectsToIds(model, req, function(results)
    //     {
    //         model = results;
    //     });
    // }
    // else 
    // {
    //     // populate model with request item properies
    //     model = res.locals.buildItem(model);
    // }

    // console.log('Adding item: ' + JSON.stringify(model));
    // model.save(function(err)
    // {
    //     if (err)
    //         callback(err);
    //     else callback(model);
    // });
    //next();
}

// update metric 
ResourceProvider.prototype.updateItem = function(model, req, res, callback) 
{
	// NOTE: This update is not a full update but partial update
	// Object validation is supported
	// store id locally
	var id = req.params.id;

    // hold prototype reference
    var proto = this;

	// validate id
	/*if (id.match(/^[0-9a-fA-F]{24}$/))
	    console.log("id valid!");
	else return res.send("invalid id");*/

	// get update parameters
	var params = req.body;

	// get existing item, update it, then save (supports validators)
	model.findById(id, function(err, item)
	{
	    if (err)
	        callback(err);
	    else
	    {
	    	// handle null items
            if (item == null)
            {
                return callback(ERROR_RESOURCE_NOT_FOUND)//"Error: Requested resource not found")
            }
            // first, check for model.getPopulates()
            if (typeof(item.getPopulates) === "function")
            {
                proto.objectsToIds(item, req, function(results)
                {
                    item = results;
                });
            }
            else 
            {
    	        //update supplied properties
    	        for (var name in req.body)
                {
                    console.log("---> " + name + " = " + req.body[name] + "\n\n");
    	            item[name] = req.body[name];
                }
            }
            //console.log("pages " + JSON.stringify(item.pages));
            //item.pages=null;
	        // save it (includes validation)
	        item.save(function(err, ritem, numberAffected)
	        {
	            if (err)
	            {
	            	console.log("ERROR: " + JSON.stringify(err) + "\n"+JSON.stringify(item));
	                return callback(err);
	            }
	            else if (typeof(item.getPopulates) === "function") 
                {
                    console.log("We have saved...\n" + JSON.stringify(ritem));
	            	//return callback(ritem);
                    //data['model']
                    console.log("\nnow returning...\n");
                    model
                    .findById(ritem._id)
                    .populate(item.getPopulates())//'userPermissions')
                    .exec (function(err, item3)
                    {
                        if (err) 
                            callback(err);
                        else
                        {
                            console.log("*** "+JSON.stringify(item3))
                            return callback(item3);
                        }
                    });
                }
                else
                {
                    return callback(ritem);
                }
                    // model.findById(ritem._id, function(err, ritem2)
                    // {
                    //     console.log("getting results... "+ritem._id);
                    //     if (err)
                    //         callback(err);
                    //     else
                    //     {
                    //         console.log(JSON.stringify(ritem2)); 
                    //         return callback(ritem2);
                    //     }
                    // });
                //}
	        });
	    }
	})
}
 
ResourceProvider.prototype.deleteItem = function(model, req, res, next, callback) 
{
    var id = req.params.id;

    console.log("req.param : "+req.params);

    // if id is invalid, we have an object
    // if(id==null || val===false)
    // {
    //     id = req.body._id;
    // }

    model.findByIdAndRemove(id, function (err,item)
    {
        if (err)
            return callback(err);
        else return callback(item);
    });
}

/*ResourceProvider.prototype.patchMetrics = function(data) 
{
    // Note: this method does not support model validation (see updateMetrics)
   return function(req, res) 
    {
        var id = req.params.id;

        var params = req.body;
        var metric = data.mongoose.MetricsModel;

        metric.findByIdAndUpdate(id, params, function (err,item)
        {
            if (err)
                return res.send(err);
            else return res.send(item);
        });
    }
}*/

module.exports.ResourceProvider = ResourceProvider;