// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Pages = new Schema(
	{
		label:         	{ type:String, required:false },
		visible:    		{ type:Boolean, required:false, default:true },
		index:      		{ type:Number, required:false },
		startIndex:    	{ type:Number, required:false },
		isLibrary:		{ type:Boolean, required:false},
		libraryLabel:		{ type:String, required:false},
		libraryDescription: { type:String, required:false},
		dateCreated:   	{ type:Date, required: false, default: Date.now },
		dateEdited:    	{ type:Date, required: false, default: Date.now },
		pageLogic:	    	[ 'Logic' ],
		piping:         	[ 'Piping' ],
		metrics:       	[ { type:Schema.Types.ObjectId, ref:'Metrics'} ]
	});

	Pages.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "metrics";
	});

	Pages.pre('save', function(next)
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
		
		next();
	});

	// Pages.methods.preSave = function testFunc(params)//, callback) 
	// {
	// 	console.log("\n\nWE ARE presaving PAGES...\n" + JSON.stringify(this));
	// 	//console.log("myid: " + mongoose.Types.ObjectId(page))
	// 	//this.pages = [1];
	// 	var casted = this.metrics.map(function( metric ) 
	// 	{
	// 		console.log("myid: " + mongoose.Types.ObjectId(metric))
	// 		return mongoose.Types.ObjectId(metric);
	// 	});
	// 	return this;
	// }

	mongoose.model('Pages', Pages);
}
