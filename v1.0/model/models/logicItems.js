// init
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var LogicItems = new Schema(
	{
		conditional:  	 	{ type:String, enum: ["and", "or", "none"], required:false },
		operator: 		{type:String, enum: ["is in list", "is not in list", "is equal to", "is not equal to", "is answered", "is not answered"], required:false},
		//dateCreated:    { type:Date, required: false, default: Date.now },
		// dateEdited:     { type:Date, required: false, default: Date.now }
		value: 			{type:String, required:false},
		tableItemIndex: 	{ type:Number, required:false},
		metric: 			[{ type:Schema.Types.ObjectId, ref:'Metrics'}]
	});

	LogicItems.method("getPopulates", function()
	{
		// space delimited, eg. "pages permissions logic"
		return "metric";
	});

	mongoose.model('LogicItems', LogicItems);
}
