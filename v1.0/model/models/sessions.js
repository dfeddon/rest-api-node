// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Sessions = new Schema(
	{
		user:       	[ { type:Schema.Types.ObjectId, ref:'Users'} ],
		study:       	[ { type:Schema.Types.ObjectId, ref:'Studies'} ],
		survey:       	[ { type:Schema.Types.ObjectId, ref:'Surveys'} ],
		lastPage:     	[ { type:Schema.Types.ObjectId, ref:'Pages'} ],
		completed: 	{ type:Boolean, required:false, default:false },
		dateCompleted: { type:Date, required: false }
	});

	Sessions.method("getPopulates", function()
	{
		// space delimited, eg. "Sessions permissions logic"
		return "user study survey lastPage";
	});

	Sessions.pre('save', function(next)
	{
		// get date
		now = new Date();
		// update edited date
		//this.dateEdited = now;
		// if created date is null, save it
		if (this.completed == true) 
		{
			this.dateCompleted = now;
		}

		next();
	});


	mongoose.model('Sessions', Sessions);
}
