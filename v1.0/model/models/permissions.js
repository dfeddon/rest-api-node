// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var PermissionsSchema = new Schema(
	{
		dateCreated:	{ type:Date, required: false, default: Date.now },
		dateEdited:    { type:Date, required: false, default: Date.now },
		isGlobal: 	{ type:Boolean, default:true },
		userPermissions:[ "UserPermissions" ],
	});
	mongoose.model('Permissions', PermissionsSchema);
}