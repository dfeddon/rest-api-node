// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var ConstructItems = new Schema(
	{
	  tableItemId:         [ { type:Schema.Types.ObjectId, ref:'TableItems'} ],
	  metricId:    	   [ { type:Schema.Types.ObjectId, ref:'Metrics'} ],
	  tableItemLabel:      { type:String, required:false }
	});

	mongoose.model('ConstructItems', ConstructItems);
}
