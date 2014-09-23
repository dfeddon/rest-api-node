// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Clients = new Schema(
	{
		name:           { type:String, required:true, unique: true },
		clientId:    	{ type:String, required:true, unique: true },
		clientSecret:   { type:String, required:true }
	});
	mongoose.model('Clients', Clients);
}
