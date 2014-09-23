// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectIdSchema = Schema.ObjectId;

//var id = mongoose.Types.ObjectId();

// schema
module.exports = function()
{
	var MetricItemsSchema = new Schema(
	{
	  //_id:            { type:ObjectIdSchema, default: function () { return new ObjectID()} },
	  label:          { type:String, required:false},
	  index:    	   { type:Number, required:false},
	  type:           { type:String, required:false},
	  value:          { type:Number, required:false},
	  dateCreated:    { type:Date, required: false, default: Date.now },
	  dateEdited:     { type:Date, required: false, default: Date.now },
	});
	mongoose.model('MetricItems', MetricItemsSchema);
}
