// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Metrics;
// schema
module.exports = function()
{
	var Metrics = new Schema(
	{
		label:          	{ type:String, required: false },
		index:  		 	{ type:Number, required: false},
		description:    	{ type:String, required: false },
		isEditable:	 	{ type:Boolean, default:false},
		variable:       	{ type:String, required: false },
		variableAuto:       { type:Boolean, required: false, default:false},
		stem:           	{ type:String, required: false },
		instructions:   	{ type:String, required: false },
		response:       	{ type:Array, required: false },
		type:           	{ type:String, enum: ["radio","checkbox","dropdown","text","essay","likert","semantic differential"], required: false },
		layout:         	{ type:String, enum:["horizontal","vertical"], required: false, default: "horizontal" },
		isImmersyve:    	{ type:Boolean, required: false, default: false },
		isPreset:    		{ type:Boolean, required: false, default: false },
		presetLabel:   	{ type:String, required: false },
		required:       	{ type:Boolean, required: false, default: false },
		randomize:      	{ type:Boolean, required: false, default: false },
		reverse:        	{ type:Boolean, required: false, default: false },
		visible:        	{ type:Boolean, required: false, default: true },
		remove:         	{ type:Number, required: false, default: 0 },
		randomizeItems: 	{ type:Boolean, required: false, default: false },
		conditions:     	{ type:Array, required: false },
		scale:          	{ type:Number, required: false, default: null},
		libraryType:    	{ type:String, enum:["none","single","group"], default: "none"},
		libraryLabel:		{ type:String, required:false},
		libraryDescription: { type:String, required:false},
		dateCreated:    	{ type:Date, required: false, default: Date.now },
		dateEdited:     	{ type:Date, required: false, default: Date.now },
		piping:         	[ 'Piping' ],
		items:          	[ 'MetricItems' ],
		tableItems:     	[ 'TableItems' ],
		metricLogic:        [ 'Logic' ],
		permissions:    	[ 'Permissions' ]
		//conditions:     	[ "MetricConditions" ]
	});
	// validate type
	// MetricsSchema.path('type').validate(function(value)
	//   {
	//     return /radio|checkbox|dropdown|text|essay|likert|semantic/i.test(value);
	//   },
	//   'Invalid metric type'
	// );

	// // validate layout
	// MetricsSchema.path('layout').validate(function(value)
	//   {
	//     return /vertical|horizontal/i.test(value);
	//   }, 
	//   'Invalid metric type'
	// );
	Metrics.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "metricLogic.logicSets.logicItems.metric";
	});

	Metrics.pre('save', function(next)
	{
		// get date
		now = new Date();
		// update edited date
		this.dateEdited = now;
		// if created date is null, save it
		if (!this.dateCreated) 
		{
			this.dateCreated = now;
		}

		// add tableItem id's
		console.log('=== metrics pre-save!')
		//console.log(this);
		for (var i = 0; i < this.tableItems.length; i++)
		{
			if (!this.tableItems[i]._id)
			{
				//console.log('is id undefined');
				//console.log(this.tableItems[i]);
				this.tableItems[i]._id = mongoose.Types.ObjectId();
				//console.log(this.tableItems[i].uid);
			}
		}
		//console.log(this.tableItems);
		
		next();
	});
	// Metrics.pre('save', function(next)
	// {
	// 	console.log("METRICS PRE SAVE **********\n" + this);
	// 	// var casted = this.pages.map(function( page ) 
	// 	// {
	// 	// 	console.log("myid: " + mongoose.Types.ObjectId(page))
	// 	// 	return mongoose.Types.ObjectId(page);
	// 	// });
	// });

	// Metrics.methods.preSave = function testFunc(params)//, callback) 
	// {
	// 	//console.log("\n\nWE ARE presaving...<br>" + JSON.stringify(this));
	// 	//console.log("myid: " + mongoose.Types.ObjectId(page))
	// 	//this.pages = [1];
	// 	// var casted = this.metrics.map(function( metric ) 
	// 	// {
	// 	// 	console.log("myid: " + mongoose.Types.ObjectId(metric))
	// 	// 	return mongoose.Types.ObjectId(metric);
	// 	// });
	// 	return this;
	// }

	mongoose.model('Metrics', Metrics);

	/*Metrics.pre("find", function(next, done)
	{
	})
	console.log(": "+this.path)
	// validate type
	mongoose.models["Metrics"].schema.path('type').validate(function(value)
	  {
	    return /radio|checkbox|dropdown|text|essay|likert|semantic/i.test(value);
	  }, 
	  'Invalid metric type'
	);

	// validate layout
	mongoose.models["Metrics"].schema.path('layout').validate(function(value)
	  {
	    return /vertical|horizontal/i.test(value);
	  }, 
	  'Invalid metric type'
	);*/
}
