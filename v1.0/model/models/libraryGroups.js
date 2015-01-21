// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var LibraryGroups = new Schema(
	{
		label: 		   { type:String, required:false },
		type: 	   	   { type:String, enum:["metrics", "pages"], required:false },
		metrics:    	   [ { type:Schema.Types.ObjectId, ref:'Metrics'} ],
		pages:    	   [ { type:Schema.Types.ObjectId, ref:'Pages'} ]
	});

	LibraryGroups.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "metrics pages";
	});

	mongoose.model('LibraryGroups', LibraryGroups);
}