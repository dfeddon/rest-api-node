// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Surveys = new Schema(
	{
		label:       		{ type:String, required:false },
		description:    	{ type:String, required:false },
		status:    		{ type:String, enum:["active", "inactive", "test"], required:false, default:"inactive" },
		minimumRequired: 	{ type:Number, required: false },
		flagResponse: 		{ type:Number, required: false },
		respondents: 		{ type:Number, required: false },
		password:			{ type:String, required: false },
		template:			{ type:Boolean, default: false },
		backButtonEnabled:	{ type:Boolean, default: false },
		progressBarEnabled:	{ type:Boolean, default: false },
		dateCreated:    	{ type:Date, required: false, default: Date.now },
		dateEdited:     	{ type:Date, required: false, default: Date.now },
		pages:      		[ { type:Schema.Types.ObjectId, ref:'Pages'} ],
		permissions:      	[ { type:Schema.Types.ObjectId, ref:'Permissions'} ]
	});

	Surveys.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "pages permissions";
	});

	Surveys.pre('save', function(next)
	{
		// get date
		now = new Date();
		// update edited date
		this.dateEdited = now;
		// if created date is null, save it
		if (!this.dateCreated) 
		{
			this.dateCreated = now;
		}
		
		next();
	});

	//Toy.schema.path('color').validate(function (value) {
	// Surveys.path('pages').validate(function(value)
	//   {
	//   	console.log("\n\nvalidating... "+value);
	//     return ;//['test'];
	//   }
	// ); 
	
	// Surveys.path("status").set(function(v)
	// {
	// 	console.log('pages '+v);
	// 	//this.pages = "HI";
	// });

	mongoose.model('Surveys', Surveys);
}
