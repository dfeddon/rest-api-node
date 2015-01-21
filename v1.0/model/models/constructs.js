// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Constructs = new Schema(
	{
	  label:          	{ type:String, required:false},
	  isImmersyve:      { type:Boolean, default:false, required:false},
	  calculation:     	{ type:String, enum: ["none","average","sum","pens2.0"], default:"none", required: false },
	  items:    		[ 'ConstructItems' ]
	});

	Constructs.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "";
	});

	mongoose.model('Constructs', Constructs);
}
