// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var MetricGroups = new Schema(
	{
		name:           { type:String, required:false  },
		description:    { type:Boolean, required:false },
		isImmersyve:    { type:Boolean, required:true, default:false },
		construct:      { type:String, required:false },
		dateCreated:    { type:Date, required: false, default: Date.now },
		dateEdited:     { type:Date, required: false, default: Date.now },
		metrics:        [ { type:Schema.Types.ObjectId, ref:'Metrics'} ]
	});
	mongoose.model('MetricGroups', MetricGroups);
}
