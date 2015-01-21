// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Presets = new Schema(
	{
	  label:        { type:String, required:false},
	  items:       [ 'PresetItems' ]
	});

	Presets.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "";
	});

	mongoose.model('Presets', Presets);
}
