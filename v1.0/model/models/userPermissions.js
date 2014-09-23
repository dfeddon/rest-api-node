// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var UserPermissionsSchema = new Schema(
	{
		user:       	{ type:Schema.Types.ObjectId, ref: 'User'},
		isReader:      { type:Boolean, required:false },
		isEditor:      { type:Boolean, required:false },
		isOwnder: 	{ type:Boolean, required:false}
	});
	mongoose.model('UserPermissions', UserPermissionsSchema);
}
