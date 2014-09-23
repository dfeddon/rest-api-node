// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Logic = new Schema(
	{
		action:         { type:String, enum: ["show","hide"],required:false},
		//dateCreated:    { type:Date, required: false, default: Date.now },
		//dateEdited:     { type:Date, required: false, default: Date.now }
		logicSets:      [ 'LogicSets' ]
	});

	mongoose.model('Logic', Logic);
}
