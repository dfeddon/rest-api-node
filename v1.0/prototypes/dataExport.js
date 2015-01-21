
var DataExport = function(){"UIUIUIUIUIUIUIUIU"}

///////////////////
// constants
///////////////////
var ERROR_RESOURCE_NOT_FOUND = 'Error: Requested resource {:id} not found';
//var mongoose = require('../../v1.0/model/index');//require('mongoose');
//var mongoosejs = require('mongoose');


DataExport.prototype.exportSurvey = function()//data, req, res, next, callback) 
{
    console.log("=========== exporting ===========");
    var that = this;
    // get route target
    //var route = req.url.split("/");
    //var principal = route[2];
    // get id to copy
    //var id = req.params.id;
    
    //console.log(route[2] + "/" + JSON.stringify(req.query));
    console.log('survey', req.query.survey);
    console.log('study', req.query.study);

    // First, get header variables from survey metrics
    // get survey
    var req1 = new Object();
    req1.params = new Object();
    req1.params.id = req.query.survey;
    //var surveyId = req.query.survey
    console.log(req1);
    //console.log
    var metricVariables = new Array();
    this.findById({model:mongoose.Surveys,populate:""}, req1, res, function(results)
    {
        console.log('found survey', results.pages.length);
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
                        console.log("*** likert");
                        console.log(item);
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
                        else console.log('undefined found!~!~~!');
                    }
                });
                //console.log(i, results.pages.length);
                if (pgCount == results.pages.length)
                {
                    console.log("we're done! Below are the survey's csv headers");
                    console.log(metricVariables);

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
        .find({survey:req.query.survey})//, study:req.query.study})
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
                        getResponses();
                    }
                    else count++;
                });
            }
        })
    }
    // based on survey and study
    //MyModel.find().distinct('_id', function(error, ids)
        var getResponses = function()
        {
            console.log('#################', req.query.survey);//, req.query.study);
            data.model
            .find({survey:req.query.survey})//, study:req.query.study})
            .sort('session')
            .exec (function(err, item3)
            {
                if (err) 
                    return callback(err);
                else
                {
                    //console.log("*** "+JSON.stringify(item3), item3.length);
                    //return callback(item3);
                    var res = new Array();
                    var variable;
                    var value;
                    item3.forEach(function(item) // metricResponse
                    //for (var i in item3)
                    {
                        // first, ascertain metric type
                        //console.log(item.responseItems);

                        item.responseItems.forEach(function(rItem)
                        // for (var x in item3[i].responseItems)
                        {
                            //console.log(rItem.type, rItem.variable, rItem.value);

                            // Semantic Diff
                            if (rItem.type == "semantic differential")
                            {
                                // Tables
                                if (rItem.table)
                                {
                                    //console.log("table", rItem.table);
                                    //console.log("* var", rItem.table.variable);
                                    variable = rItem.table.variable;
                                }
                                // Single
                                else
                                {
                                    //console.log("single item!");
                                    variable = rItem.variable;
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
                            console.log("\n**Type:", rItem.type);
                            console.log("** Variable:", variable);
                            console.log("** Value:", value);
                        });
                        //if (item3[i].survey == req.query.survey && item3[i].study == req.query.study)
                        //{
                            //res.push(item3);
                       // }
                    });
                    //return callback(res);

                    // Then, get iterate responses by session 
                    // (and survey, just to be sure)
                    // http://54.235.192.94:1337/api/response/?survey=54b0163a14c8d02d2135ed92&session=9eb5dbac-9791-402b-04e9-d2df972bf07d
                }
            });
        }

    //if (principal == "metrics")
 }
