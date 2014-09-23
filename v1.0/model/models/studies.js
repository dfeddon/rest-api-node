// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Studies = new Schema(
	{
		name:           { type:String, required:true },
		description:    { type:String, required:false },
		visible:    	{ type:Boolean, required:true, default:true },
		index:      	{ type:Number, required:false },
		//logic:    		{ type:Date, required: false, default: Date.now },
		dateCreated:    { type:Date, required: false, default: Date.now },
		dateEdited:     { type:Date, required: false, default: Date.now },
		metrics:        [ { type:Schema.Types.ObjectId, ref:'Metrics'} ]
	});
	mongoose.model('Studies', Studies);
}
