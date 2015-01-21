// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var PresetItems = new Schema(
	{
	  label:           { type:String, required:false},
	  value:           { type:String, required:false}
	});

	mongoose.model('PresetItems', PresetItems);
}
