// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var TableItems = new Schema(
	{
	  _id:      	   { type:Schema.Types.ObjectId },
	  name:           { type:String, required:false},
	  variable:       { type:String, required:false},
	  variableAuto:   { type:Boolean, required: false, default:false},
	  index:    	   { type:Number, required:false},
	  type:           { type:String, required:false},
	  value:          { type:Number, required:false},
	  reverse:        { type:Boolean, required:false, default:false },
	  required:       { type:Boolean, required:false, default:false },
	  leftAnchor:     { type:String, required:false},
	  rightAnchor:    { type:String, required:false},
	  dateCreated:    { type:Date, required: false, default: Date.now },
	  dateEdited:     { type:Date, required: false, default: Date.now },
	  response:       { type:Number, required:false},
	  construct:      [ {type:Schema.Types.ObjectId, ref:'Constructs'} ]
	});

	TableItems.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "construct";
	});
	// TableItems.pre('save', function(next)
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
	// 	// create uid
	// 	if (!this.id)
	// 	{
	// 		this.id = mongoose.Types.ObjectId();
	// 	}
		
	// 	next();
	// });

	mongoose.model('TableItems', TableItems);
}
