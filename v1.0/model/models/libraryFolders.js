// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var LibraryFolders = new Schema(
	{
		label:			{ type:String, required:false },
		isDefault:		{ type:Boolean, required:false, default:false },
		metrics:      		[ { type:Schema.Types.ObjectId, ref:'Metrics'} ],
		pages:      		[ { type:Schema.Types.ObjectId, ref:'Pages'} ],
		libraryGroups:   	[ { type:Schema.Types.ObjectId, ref:'LibraryGroups'} ]
	});

	LibraryFolders.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "pages metrics libraryGroups";
	});

	// LibraryGroups.pre('save', function(next)
	// {
	// 	// get date
	// 	now = new Date();
	// 	// update edited date
	// 	this.dateEdited = now;
	// 	// if created date is null, save it
	// 	if (!this.dateCreated) 
	// 	{
	// 		this.dateCreated = now;
	// 	}
		
	// 	next();
	// });

	//Toy.schema.path('color').validate(function (value) {
	// LibraryGroups.path('pages').validate(function(value)
	//   {
	//   	console.log("\n\nvalidating... "+value);
	//     return ;//['test'];
	//   }
	// ); 
	
	// LibraryGroups.path("status").set(function(v)
	// {
	// 	console.log('pages '+v);
	// 	//this.pages = "HI";
	// });

	mongoose.model('LibraryFolders', LibraryFolders);
}
