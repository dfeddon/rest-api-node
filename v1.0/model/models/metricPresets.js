// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var MetricPresets = new Schema(
	{
		label:           	{ type:String, required:false},
		index:    	   	{ type:Number, required:false},
		type:           	{ type:String, enum: ["radio","checkbox","dropdown","text","essay","likert","semantic differential"], required: false },
		items:          	[ 'MetricItems' ],
		tableItems:     	[ 'TableItems' ]
	});
	mongoose.model('MetricPresets', MetricPresets);
}
