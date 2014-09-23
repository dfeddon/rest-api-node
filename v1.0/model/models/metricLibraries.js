// // init
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// // schema
// module.exports = function()
// {
// 	var MetricLibrariesSchema = new Schema(
// 	{
// 	  label:          { type:String, required:false},
// 	  description:    { type:String, required:false},
// 	  metrics:    	   [ { type:Schema.Types.ObjectId, ref:'Metrics'} ]
// 	  //groups:    	   [ { type:Schema.Types.ObjectId, ref:'LibraryGroups'} ]
// 	});

// 	MetricLibrariesSchema.method("getPopulates", function()
// 	{
// 		// space delimited, eg. "pages permissions logic"
// 		return "metrics";
// 	});

// 	mongoose.model('MetricLibraries', MetricLibrariesSchema);
// }
