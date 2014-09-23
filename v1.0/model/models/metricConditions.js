// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var MetricConditionsSchema = new Schema(
	{
	  name:           { type:String, required:true},
	  description:    { type:String, required:true},
	  type:           { type:String, required:true},
	  dateCreated:    { type:Date, required: false, default: Date.now },
	  dateEdited:     { type:Date, required: false, default: Date.now }
	});
	mongoose.model('MetricConditions', MetricConditionsSchema);
}
