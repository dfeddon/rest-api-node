// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Piping = new Schema(
	{
		type:  	 	{ type:String, enum: ["repeat", "populate"], required:false },
		selected: 	{type:Boolean, required:false},
		metric: 		[{ type:Schema.Types.ObjectId, ref:'Metrics'}]
	});

	Piping.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "metric";
	});

	mongoose.model('Piping', Piping);
}
