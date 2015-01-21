// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var MetricResponses = new Schema(
	{
		index: 		{ type:Number, required:false },
		dateCompleted: { type:Date, required: false },
		responseItems: [ 'ResponseItems' ],
		session:       { type:String, required: false},
		//study:       	[ { type:Schema.Types.ObjectId, ref:'Studies'} ],
		survey:       	[ { type:Schema.Types.ObjectId, ref:'Surveys'} ],
		page:       	[ { type:Schema.Types.ObjectId, ref:'Pages'} ],
		metric:       	{ type:String, required: false }
		//metric:       	[ { type:Schema.Types.ObjectId, ref:'Metrics'} ]
	});

	MetricResponses.method("getPopulates", function()
	{
		// space delimited, eg. "MetricResponses permissions logic"
		//return "session study survey page metric";
		return "";
	});
	mongoose.model('MetricResponses', MetricResponses);
}
