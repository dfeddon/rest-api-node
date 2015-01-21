// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Iterations = new Schema(
	{
		label:           { type:String, required:false },
		description:    { type:String, required:false },
		//visible:    	{ type:Boolean, required:true, default:true },
		//index:      	{ type:Number, required:false },
		//logic:    		{ type:Date, required: false, default: Date.now },
		dateCreated:    { type:Date, required: false, default: Date.now },
		dateEdited:     { type:Date, required: false, default: Date.now },
		studies:        [ { type:Schema.Types.ObjectId, ref:'Studies'} ]
	});

	Iterations.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "studies";
	});

	Iterations.pre('save', function(next)
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

	mongoose.model('Iterations', Iterations);
}
