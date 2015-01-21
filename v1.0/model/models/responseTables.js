// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var ResponseTables = new Schema(
	{
		index:  		{ type:Number, required:false },
		label: 		{ type:String, required:false },
		variable: 	{ type:String, required: false },
		reverse: 		{ type:Boolean, required: false, default: false },
		leftAnchor:   	{ type:String, required: false },
		rightAnchor:   { type:String, required: false },
		construct: 	[ 'Constructs' ]
	});

	ResponseTables.method("getPopulates", function()
	{
		// space delimited, eg. "ResponseTables permissions logic"
		return "";
	});
	mongoose.model('ResponseTables', ResponseTables);
}
