// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var TableItemsSchema = new Schema(
	{
	  name:           { type:String, required:false},
	  index:    	   { type:Number, required:false},
	  type:           { type:String, required:false},
	  value:          { type:Number, required:false},
	  reverse:        { type:Boolean, required:false, default:false },
	  required:       { type:Boolean, required:false, default:false },
	  leftAnchor:     { type:String, required:false},
	  rightAnchor:    { type:String, required:false},
	  dateCreated:    { type:Date, required: false, default: Date.now },
	  dateEdited:     { type:Date, required: false, default: Date.now },
	  response:       { type:Number, required:false}
	});
	mongoose.model('TableItems', TableItemsSchema);
}
