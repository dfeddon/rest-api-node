// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Studies = new Schema(
	{
		label:           { type:String, required:false },
		description:    { type:String, required:false },
		//visible:    	{ type:Boolean, required:true, default:true },
		//index:      	{ type:Number, required:false },
		//logic:    		{ type:Date, required: false, default: Date.now },
		dateCreated:    { type:Date, required: false, default: Date.now },
		dateEdited:     { type:Date, required: false, default: Date.now },
		surveys:        [ { type:Schema.Types.ObjectId, ref:'Surveys'} ]
	});
	Studies.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "surveys";
	});

	Studies.pre('save', function(next)
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
	mongoose.model('Studies', Studies);
}
