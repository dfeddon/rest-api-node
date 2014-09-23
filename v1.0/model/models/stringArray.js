// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var StringArray = new Schema(
	{
		label:       		[{type: String, trim: true}]
	});
	mongoose.model('Surveys', Surveys);
}
