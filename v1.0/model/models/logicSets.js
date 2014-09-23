// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var LogicSets = new Schema(
	{
		conditional:  	 { type:String, enum: ["and", "or", "none"], required:false },
		//dateCreated:    { type:Date, required: false, default: Date.now },
		// dateEdited:     { type:Date, required: false, default: Date.now }
		logicItems:      [ 'LogicItems' ]
	});

	mongoose.model('LogicSets', LogicSets);
}
