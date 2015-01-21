
var ResourceProvider = function(){}

///////////////////
// constants
///////////////////
var ERROR_RESOURCE_NOT_FOUND = 'Error: Requested resource {:id} not found';
var mongoose = require('../../v1.0/model/index');//require('mongoose');
var mongoosejs = require('mongoose');
var fs = require('fs'); // file save i/o
// models
//var DataExport = require('./dataExport').DataExport;

//var metricsModel = mongoose.Metrics;
ResourceProvider.prototype.metricsPopulates = "metricLogic.logicSets.logicItems.metric";
//var pagesModel = mongoose.Pages;
ResourceProvider.prototype.pagesPopulates = "metrics";
//var surveysModel = mongoose.Surveys;
ResourceProvider.prototype.surveysPopulates = "pages";


///////////////////
// api's 
///////////////////

// deep copy
// https://gist.github.com/Trindaz/2234277
// ResourceProvider.prototype.processObjWithRef = function(obj, result)
// {
//     //console.log('deep copy');
//     //console.log(obj);
//     if(obj==null || typeof obj != 'object')
//     {
//         //nothing really to do here - you're going to lose the reference to result if you try an assignment
//     }
//     if(obj instanceof Array) 
//     {
//         for(var i=0; i<obj.length; i++)
//         {
//             result.push();
//             this.processObjWithRef(obj[i], result[i]);
//         }
//     }    
//     if(obj instanceof Object)
//     {
//         for(var k in obj)
//         {
//             console.log(k, obj[k]);
//             var count=0;
//             if(obj[k]==null || typeof obj[k] != 'object')
//             {
//                 result[k] = obj[k];
//             }
//             else if(obj[k] instanceof Array) 
//             {
//                 result[k] = [];
//                 this.processObjWithRef(obj[k], result[k]);
//             }
//             else if(obj[k] instanceof Object)
//             {
//                 result[k] = {};
//                 for( var attr in obj[k])
//                 {
//                     this.processObjWithRef(obj[k], result[k]);
//                 }
//             }
//         }
//     }
// }

// deep copy
// http://www.connecto.io/blog/deep-copyingcloning-of-mongoose-object/
ResourceProvider.prototype.deepCopy = function(obj1, callback)
{
    //console.log('deep copy');
    //console.log(obj1)
    var objectIdDel = function(obj) 
    {
        //console.log('objectIdDel');
        //console.log(obj);
        if (obj != null && typeof(obj) != 'string' &&
        typeof(obj) != 'number' && typeof(obj) != 'boolean' ) 
        {
            //for array length is defined however for objects length is undefined
            if (typeof(obj.length) == 'undefined') 
            {
                if (obj._id) 
                {
                    // add new id
                    delete obj._id;
                    obj._id = mongoosejs.Types.ObjectId();// toString();
                }
                if (obj.dateCreated)
                    delete obj.dateCreated;
                if (obj.dateEdited)
                    delete obj.dateEdited;
                for (var key in obj) 
                {
                    objectIdDel(obj[key]); //recursive del calls on object elements
                }
            }
            else 
            {
                for (var i = 0; i < obj.length; i++) 
                {
                    objectIdDel(obj[i]);  //recursive del calls on array elements
                }
            }
        }
        //console.log("=============");
        //console.log(obj);
    }
    var obj = JSON.parse(JSON.stringify(obj1));
    objectIdDel(obj)
    //console.log("deep copy done!");
    //console.log(obj);
    return callback(obj);
}

// find metric by id
ResourceProvider.prototype.objectsToIds = function(item, req, callback) 
{
    console.log("\nwe have populates!");
    //console.log(item);
    // get available populates
    var populates = item.getPopulates().split(" ");
    console.log(populates.length);
    // next, determine which populates are in req.body
    for (var i = 0; i < populates.length; i++) 
    {
        console.log("\npopulate->"+populates[i]);
        for (var prop in req.body)
        {
            console.log("\npop="+populates[i]+"/"+prop);
            if (prop == populates[i])
            {
                console.log("\nwe have a match (an object)");
                console.log(item[prop]);
                console.log(Array.isArray(item[prop]));
                console.log(item[prop].length);
                // clear item's property
                while(item[prop].length > 0) 
                {
                    var removed = item[prop].pop();
                    //console.log('removed');
                    //console.log(removed);
                    //console.log(typeof removed);
                }
                for (var bodyItem in req.body[prop])
                {
                    // store item in var
                    var citem = req.body[prop][bodyItem];
                    //console.log('adding');
                    //console.log(req.body[prop]);
                    // validate that populates in req.body are objects (_id)
                    if (citem._id)
                    {
                        // convert id to string
                        citemStr = String(citem._id);
                        //citemStr = JSON.stringify(citem._id);
                        // validate id
                        if (citemStr.match(/^[0-9a-fA-F]{24}$/))
                            item[prop].push(mongoosejs.Types.ObjectId(citemStr));
                        else console.log("error: invalid id ", citemStr);
                        //item[prop].push(citem._id);
                    }
                    else // not an object, likely id string
                    { 
                        console.log("not an object, assumption is id's were passed instead");
                        console.log(prop);
                        console.log(item[prop]);
                        console.log('citem');
                        console.log(citem);
                        console.log(Array.isArray(citem));
                        console.log(Array.isArray(item[prop]));
                        //console.log(res.locals.createGUID());
                        // validate that item is an mongo id, if so, cast it
                        if (citem.match(/^[0-9a-fA-F]{24}$/))
                            item[prop].push(mongoosejs.Types.ObjectId(citem));
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
    console.log(item);
    return item;
}

// copy

ResourceProvider.prototype.copyMetric = function(data, req, res, next, callback) 
{
    //console.log("copyMetric...");//, this.metricsPopulates);
    // hold reference
    var proto = this;
    // generate new object id (via mongoose)
    var newId = mongoosejs.Types.ObjectId();
    // get called item to copy
    this.findById(data, req, res, function(results)
    {
        // bind new _id
        results._id = newId;
        // clear version key
        results.__v = undefined;
        // set isNew to true (required!)
        results.isNew = true;
        // bind copy to req.body for saving to mongo
        req.body = results;
        // save to mongo
        proto.addItem(mongoose.Metrics, req, res, next, function(results2)
        {
            // return metric copy
            return callback(results2);
        });
    });
}

// copy page
ResourceProvider.prototype.copyPage = function(data, req, res, next, callback) 
{
    // hold reference
    var proto = this;
    // generate new page id (via mongoose)
    var newId = mongoosejs.Types.ObjectId();
    // get called page to copy
    this.findById(data, req, res, function(results)
    {
        proto.deepCopy(results, function(mycopy)
        {
            // account for no metrics
            if (mycopy.metrics.length == 0)
            {
                var nmpreq = new Object();
                nmpreq.body = mycopy;

                // lastly, save page
                proto.addItem(mongoose.Pages, nmpreq, res, next, function(pageResults)
                {
                    return callback(pageResults);
                });
            }
            // otherwise, let's save metrics
            var numMetrics = mycopy.metrics.length;
            var countMetrics = 1;
            // iterate metric objects
            for (var k in mycopy.metrics)
            {
                var mreq = new Object();
                mreq.body = mycopy.metrics[k];
                proto.addItem(mongoose.Metrics, mreq, res, next, function(metricResults)
                {
                    if (countMetrics == numMetrics)
                    {
                        var preq = new Object();
                        preq.body = mycopy;

                        // lastly, save page
                        proto.addItem(mongoose.Pages, preq, res, next, function(pageResults)
                        {
                            return callback(pageResults);
                        });
                    }
                    countMetrics++;
                });
            }
        });
    });
}

ResourceProvider.prototype.copySurvey = function(data, req, res, next, callback) 
{
    //console.log("copySurvey...", req.params.id);

    var proto = this;
    // get survey
    this.findById(data, req, res, function(results)
    {
        var pTotal = results.pages.length;
        var count = 1;
        var preq = {};
        preq.params = {};
        var pdata = {};
        pdata.model = mongoose.Pages;
        pdata.populate = "metrics";
        var popMetrics = new Array();
        // before deep copying, we need to populate page metrics
        (function getMetrics()
        {
            preq.params.id = results.pages[count-1]._id;
            proto.findById(pdata, preq, res, function(gotPage)
            {
                popMetrics.push(gotPage);
                if (count == pTotal)
                {
                    results.pages = popMetrics;

                    var numPages = results.pages.length;
                    var countPages = 1;
                    var popPages = new Array();

                    (function copyPage()
                    {
                        // save page copies
                        // req.params.id
                        var pagesData =
                        {
                          "model":mongoose.Pages,
                          "populate":"metrics"
                        };
                        var pcreq = {};
                        pcreq.params = {};
                        pcreq.params.id = results.pages[countPages-1]._id;
                        proto.copyPage(pagesData, pcreq, res, next, function(pageCopy)
                        {
                            popPages.push(pageCopy._id.toString());

                            if (countPages == numPages)
                            {
                                // deep copy survey
                                proto.deepCopy(results, function(surveyCopy)
                                {
                                    // rebuild requestor
                                    surveyCopy.pages = popPages;
                                    var sreq = new Object();
                                    sreq.body = surveyCopy;//newSurvey;

                                    // change/delete survey id
                                    proto.addItem(mongoose.Surveys, sreq, res, next, function(surveyResult)
                                    {
                                        return callback(surveyResult);
                                    });
                                });
                            }
                            else
                            {
                                countPages++;

                                //return;
                                copyPage();
                            }
                        });
                    })();
                }
                else // still counting...
                {
                    ++count;
                    getMetrics();
                }
            });
        })();
    });
}

ResourceProvider.prototype.copyStudy = function(data, req, res, next, callback) 
{
    var proto = this;
    // get study
    this.findById(data, req, res, function(results)
    {
        var numSurveys = results.surveys.length;
        var countSurveys = 1;
        var popSurveys = new Array();

        (function copySurvey()
        {
            var surveysData =
            {
                "model":mongoose.Surveys,
                "populate":"pages"
            };

            screq = {};
            screq.params = {};
            screq.params.id = results.surveys[countSurveys-1]._id;
            proto.copySurvey(surveysData, screq, res, next, function(surveyCopy)
            {
                console.log(surveyCopy);
                popSurveys.push(surveyCopy._id.toString());

                if (countSurveys == numSurveys)
                {
                    // done counting
                    // deep copy study
                    proto.deepCopy(results, function(studyCopy)
                    {
                        // append popSurveys to surveys prop
                        studyCopy.surveys = popSurveys;

                        // rebuild requestor
                        var sreq = new Object();
                        sreq.body = studyCopy;                        

                        // POST new study
                        proto.addItem(mongoose.Studies, sreq, res, next, function(studyResults)
                        {
                            // copy finished
                            // return copy
                            return callback(studyResults);
                        })
                    });
                }
                else // still counting...
                {
                    countSurveys++;
                    copySurvey();
                }
            });
        })();
    });
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
        {
       	    callback(err);
        }
        else
        { 
            callback(item);
        }
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
    // console.log("+++++++++++++query");
    console.log(query);
    // console.log(req.query);
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
    //console.log('addItem: ' + JSON.stringify(item));

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

    //console.log('Adding item: ' + JSON.stringify(model));
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
    var body_orig = req.body; // store this for return

    var saveItem = function()
    {
        for(var itm in req.body)
        {
            console.log(req.body[itm]);
        }
        var items = req.body;
        // store total
        var batchTotal = Object.keys(req.body).length;
        // start counter
        var count = 1;
        for (var item in items)
        {
            // create an instance of model
            var imodel = new model();

            if (typeof(model.getPopulates) === "function")
            {
                req.body = items[item];
                // ISSUE: req can handle only single items, not an array of items
                // FIX: send "item" here, "req.body" elsewhere
                this.objectsToIds(model, req, function(results)
                {
                    imodel = results;
                });
            }
            else 
            {
                // ISSUE: req.body in buildItem fnc can handle only single items, not an array of items
                // populate model with request item properies
                // FIX: send "item" with model here, "req.body" with model elsewhere
                req.body = items[item];
                imodel = res.locals.buildItem(imodel);
            }

            var responseArray = new Array();

            imodel.save(function(err)
            {
                if (err)
                    return callback(err);
                else
                {
                    responseArray.push(imodel);
                    if (count == batchTotal)
                    {
                        // restore original body val
                        req.body = body_orig;
                        return callback(responseArray);
                    }
                    else count++;
                }
            });
        }
    }
    saveItem();
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
                    //console.log("---> " + name + " = " + req.body[name] + "\n\n");
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
	            	//console.log("ERROR: " + JSON.stringify(err) + "\n"+JSON.stringify(item));
	                return callback(err);
	            }
	            else if (typeof(item.getPopulates) === "function") 
                {
                    //console.log("We have saved...\n" + JSON.stringify(ritem));
	            	//return callback(ritem);
                    //data['model']
                    //console.log("\nnow returning...\n");
                    model
                    .findById(ritem._id)
                    .populate(item.getPopulates())//'userPermissions')
                    .exec (function(err, item3)
                    {
                        if (err) 
                            callback(err);
                        else
                        {
                            //console.log("*** "+JSON.stringify(item3))
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

    //console.log("req.param : "+req.params);

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

// copy item
ResourceProvider.prototype.copyItem = function(data, req, res, next, callback) 
{
    //console.log("=========== copying ===========");
    // get route target
    var route = req.url.split("/");
    var principal = route[2];
    // get id to copy
    var id = req.params.id;
    
    //console.log(route[2] + "/" + req.params.id);

    if (principal == "metrics")
    {
        //console.log("copy type is metrics...");
        this.copyMetric(data, req, res, next, function(results)
        {
            //console.log(results);
            return callback(results);
        });
    }
    else if (principal == "pages")
    {
        //console.log("copy type is pages...");
        this.copyPage(data, req, res, next, function(results)
        {
            //console.log(results);
            return callback(results);
        });
    }
    else if (principal == "surveys")
    {
        //console.log("copy type is surveys...");
        this.copySurvey(data, req, res, next, function(results)
        {
            //console.log(results);
            return callback(results);
        });
    }
    else if (principal == "studies")
    {
        //console.log("copy type is studies...");
        this.copyStudy(data, req, res, next, function(results)
        {
            //console.log('study copy complete!');
            //console.log(results);
            return callback(results);
        });
    }
}

ResourceProvider.prototype.exportSurvey = function(data, req, res, next, callback) 
{
    console.log("=========== exporting ===========");
    var that = this;
    var exportFilename = 'assets/export/export-' + req.params.id + '-' + Math.floor(Date.now() / 1000) + '.csv';
    var exportFilenameFullPath = req.url + '/' + exportFilename;
    //console.log(req.url + "/" + exportFilename);return;
    console.log(exportFilename);//return;
    // get route target
    //var route = req.url.split("/");
    //var principal = route[2];
    // get id to copy
    //var id = req.params.id;
    // console.log(typeof DataExport);
    // var dataExport = new DataExport();
    // dataExport.exportSurvey(model, req, res, next, function(results)
    // {
    //     res.send(results);
    // });
    
    //console.log(route[2] + "/" + JSON.stringify(req.query));
    console.log('survey', req.params.id);
    //console.log('study', req.query.study);

    // First, get header variables from survey metrics
    // get survey
    var req1 = new Object();
    req1.params = new Object();
    req1.params.id = req.params.id;//req.query.survey;
    //var surveyId = req.query.survey
    console.log(req1);
    //console.log
    var metricVariables = ['session'];// new Array();
    this.findById({model:mongoose.Surveys,populate:""}, req1, res, function(results)
    {
        console.log('found survey with', results.pages.length, 'pages');
        console.log(results.pages);
        //return callback(results);
        var pgCount = 1;
        results.pages.forEach(function(page)
        {
            console.log('cull metrics from each page', page);
            var req2 = new Object();
            req2.params = new Object();
            req2.params.id = page;
            that.findById({model:mongoose.Pages,populate:"metrics"}, req2, res, function(results2)
            {
                //console.log(results2.metrics);
                results2.metrics.forEach(function(item)
                {
                    console.log('metrics in', page);
                    console.log("type", item.type);

                    var metricVar;
                    
                    if (item.type == "semantic differential")
                    {
                        //console.log("*** sem diff");
                        //console.log(item);
                        item.tableItems.forEach(function(tItem)
                        {
                            //console.log("table", tItem);
                            if (tItem.variable != undefined)
                            {
                                metricVariables.push(tItem.variable);
                            }
                        });
                    }
                    else if (item.type == "likert")
                    {
                        //console.log("*** likert");
                        //console.log(item);
                        item.tableItems.forEach(function(lItem)
                        {
                            //console.log("table", tItem);
                            if (lItem.variable != undefined)
                            {
                                metricVariables.push(lItem.variable);
                            }
                        });
                    }
                    else
                    {
                        if (item.variable != undefined)
                            metricVariables.push(item.variable);
                        //else console.log('undefined found!~!~~!');
                    }
                });
                //console.log(i, results.pages.length);
                if (pgCount == results.pages.length)
                {
                    console.log("we're done! Below are the survey's csv headers");
                    console.log(metricVariables);
                    var headers = metricVariables.toString();
                    headers += "\n";

                    // write headers to file
                    fs.writeFile(exportFilename, headers, function (err) 
                    {
                        if (err) 
                        {
                            console.log(err);
                            throw err;
                        }
                        else
                        {
                            console.log('The "data to write" was written to file!');
                        }
                    });

                    // now, let's get user response data
                    getSessions();
                }
                else pgCount++;
            });
            //console.log('done with page');
        });
        // var req2 = new Object();
        // req2.params = new Object();
        // req2.params.id = req.query.survey;
        // this.findById({model:mongoose.Pages,populate:"metrics"}, req1, res, function(results)
        // {
        //     console.log('study copy complete!');
        //     console.log(results);
        //     //return callback(results);
        // });
    });
    //return;
    // get pages
    // get metrics, storing each in an array
    //mongoose.Metrics
        //.find(survey.req.)

    // Next, get unique sessions from metricresponses
    var getSessions = function()
    {
        console.log('getting sessions...');
        var sessions = new Array();

        mongoose.Sessions
        .find({survey:req.params.id})//, study:req.query.study})
        .sort('session')
        .exec (function(err, results)
        {
            if (err) 
                return callback(err);
            else
            {
                console.log('got sessions');
                //console.log(sessions);

                var total = results.length;
                console.log('len', total);
                var count = 1;
                results.forEach(function(item)
                {
                    sessions.push(item._id);

                    if (count == total)
                    {
                        console.log('sesions done');
                        console.log(sessions);
                        //getResponses();
                        getSessionResponses(sessions);
                    }
                    else count++;
                });
            }
        })
    }

    var totalSessions = 0;
    var sessionCount = 0;

    var getSessionResponses = function(sessions)
    {
        totalSessions = sessions.length;

        sessions.forEach(function(item)
        {
            console.log('sr', item);

            getResponses(item, function(results)
            {
                console.log("grdone", results);
            })
        });
    }
    // based on survey and study
    //MyModel.find().distinct('_id', function(error, ids)
        var getResponses = function(sessionid, callback2)
        {
            var session;
            console.log('#################', req.params.id);//, req.query.study);
            data.model
            .find({survey:req.params.id, session:sessionid})
            .sort('session')
            .exec (function(err, metricResponses)
            {
                if (err) 
                    return callback(err);
                else
                {
                    console.log("derek", metricResponses.length);

                    // only valid if one or more responses
                    if (metricResponses.length == 0)
                    {
                        // ignoring current session, remove from total
                        totalSessions--;
                    }
                    //if (metricResponses.length > 0)
                    else
                    {
                        var responseTotal = metricResponses.length;
                        var responseCount = 1;

                        var res = new Array();
                        var obj = new Object();
                        var variable;
                        var value;

                        metricResponses.forEach(function(item) // metricResponse
                        {
                            console.log("++", responseCount, item._id);
                            obj["session"] = item.session;
                            // first, ascertain metric type
                            //console.log(item.responseItems);

                            item.responseItems.forEach(function(rItem) // responseItems
                            // for (var x in item3[i].responseItems)
                            {
                                //console.log(rItem.type, rItem.variable, rItem.value);

                                // Semantic Diff
                                if (rItem.type == "semantic differential")
                                {
                                    var reverse = false;
                                    var construct = null;

                                    // Tables
                                    if (rItem.table)
                                    {
                                        console.log("table");
                                        console.log(rItem.table);
                                        //console.log("* var", rItem.table.variable);
                                        variable = rItem.table.variable;
                                        reverse = rItem.table.reverse;
                                        construct = rItem.table.construct;
                                    }
                                    // Single
                                    else
                                    {
                                        console.log("single item!");
                                        console.log(rItem);
                                        variable = rItem.variable;
                                        reverse = rItem.reverse;
                                        construct = rItem.construct;
                                    }
                                    console.log("********");
                                    console.log(construct);
                                    console.log(reverse);
                                    console.log("********");
                                    if (reverse == true)
                                    {
                                        console.log('reverse scoring');
                                    }
                                    value = rItem.value;
                                }
                                else if (rItem.type == "likert")
                                {
                                    //console.log("** likert!");
                                    if (rItem.table)
                                    {
                                        //console.log("likert TABLE");
                                        variable = rItem.table.variable;
                                    }
                                    else
                                    {
                                        //console.log("single");
                                        variable = rItem.variable;
                                    }
                                    value = rItem.value;
                                }
                                else
                                {
                                    variable = rItem.variable;
                                    value = rItem.value;
                                }

                                // sort by metricVariables
                                console.log("\n**Type:", rItem.type);
                                console.log("** Variable:", variable);
                                console.log("** Value:", value);

                                obj[variable] = value;//variable;
                                //obj.value = value;
                            });
                            //if (item3[i].survey == req.query.survey && item3[i].study == req.query.study)
                            //{
                                //res.push(item3);
                           // }

                           console.log('################', responseCount, responseTotal);

                           if (responseCount == responseTotal)
                           {
                            console.log('were done!!!!');
                           }
                           else responseCount++;
                        });

                        console.log('obj');
                        console.log(obj);
                        res.push(obj);
                        // now sort obj by metricVariables
                        console.log("---");
                        //console.log(metricVariables);
                        var finalize = [];
                        metricVariables.forEach(function(item)
                        {
                            console.log(item, obj[item]);

                            if (obj[item] == null || obj[item] == undefined)
                                obj[item] = '';

                            finalize.push(obj[item])

                        });
                        console.log('finalize len', finalize.length);
                        // write session data to file
                        console.log(finalize.toString());
                        var str = finalize.toString();
                        str += "\n";

                        fs.appendFile(exportFilename, str, function (err) 
                        {
                            if (err) 
                            {
                                throw err;
                            }
                            else
                            {
                                sessionCount++;
                                console.log(sessionCount, 'of', totalSessions);
                                console.log('The "data to append" was appended to file!');

                                if (sessionCount == totalSessions)
                                {
                                    console.log("write finished!");
                                    //res = exportFilenameFullPath;
                                    var resObject = new Object();

                                    // adding file link
                                    resObject.file = 'hydra-node/' + exportFilename;
                                    // number of respondents
                                    resObject.respondents = totalSessions;

                                    return callback(resObject);
                                }
                            }
                        });
                        //return callback(res);
                        //console.log("res!");
                        //console.log(res);

                        // Then, get iterate responses by session 
                        // (and survey, just to be sure)
                        // http://54.235.192.94:1337/api/response/?survey=54b0163a14c8d02d2135ed92&session=9eb5dbac-9791-402b-04e9-d2df972bf07d
                    }
                }
                callback2(responseCount);
            });
            
        }

    //console.log('db=', global.db);// mongoose.connection);
    
    // fs.appendFile('export.txt', 'data to append', function (err) {
    //   if (err) throw err;
    //   console.log('The "data to append" was appended to file!');
    // });
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