// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var AccessToken = new Schema(
	{
		userId:         { type:String, required:true },
		clientId:    	{ type:String, required:true },
		token:   		{ type:String, required:true, unique:true },
		dateCreated:	{ type:Date, default:Date.now },
	});
	mongoose.model('AccessToken', AccessToken);
}
