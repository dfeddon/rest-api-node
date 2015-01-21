// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var ResponseItems = new Schema(
	{
		index:   		{ type:Number, required:false },
		instructions: 	{ type:String, required:false },
		type:          { type:String, enum: ["radio","checkbox","dropdown","text","essay","likert","semantic differential"], required: false },
		variable: 	{ type:String, required:false },
		label: 		{ type:String, required:false },
		value: 		{ type:String, required: false },
		table:   		[ 'responseTables' ]
	});

	ResponseItems.method("getPopulates", function()
	{
		// space delimited, eg. "ResponseItems permissions logic"
		return "";
	});
	mongoose.model('ResponseItems', ResponseItems);
}
