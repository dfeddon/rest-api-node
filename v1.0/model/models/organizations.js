// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var OrganizationsSchema = new Schema(
	{
		name:           { type:String, required:true, unique: true },
		description:    { type:String, required:false },
		status:         { type:String, enum:["active","inactive"], required:true, default:"active" },
		dateCreated:    { type:Date, required: false, default: Date.now },
		dateEdited:     { type:Date, required: false, default: Date.now },
		metrics:        [ { type:Schema.Types.ObjectId, ref:'Metrics', required:false } ],
		metricGroups:   [ { type:Schema.Types.ObjectId, ref:'MetricGroups', required:false } ],
		admin:          [ { type:Schema.Types.ObjectId, ref:'Users', required:false } ]
	});

	// validate type
	OrganizationsSchema.path('status').validate(function(value)
	  {
	    return /active|inactive/i.test(value);
	  }, 
	  'Invalid organizations status type'
	);

	/*OrganizationsSchema.path('name').validate(
		function (value, done) 
		{
			mongoose.models["Organizations"].count({ name: value }, function (error, count) 
			{
			    // Return false if an error is thrown or count > 0
			    done(!(error || count));
			});
		}, 'Organization name value is not unique'
	);*/

	mongoose.model('Organizations', OrganizationsSchema);
}
