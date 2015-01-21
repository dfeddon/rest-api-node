// init
var mongoose 	= require('mongoose')
  , crypto      = require('crypto');
var Schema = mongoose.Schema;

// schema
module.exports = function()
{
	var Users = new Schema(
	{
		username:    	{ type:String, required:true, unique:true },
		firstName:    	{ type:String, required:false },
		lastName:     	{ type:String, required:false },
		email:        	{ type:String, required:false, unique: true },
		hashedPassword: { type:String, required:false },
		salt: 	    	{ type:String, required:false },
		status:       	{ type:String, enum:["active","inactive"], required:true, default:'active' },
		dateCreated:  	{ type:Date, required: false, default: Date.now },
		dateEdited:   	{ type:Date, required: false, default: Date.now },
		isAdmin:      	{ type:Boolean, required:false, default:false },
		isImmersyve:  	{ type:Boolean, required:false, default:false}
	});
	// validate type
	Users.path('status').validate(function(value)
	{
		return /active|inactive/i.test(value);
	}, 'Invalid user status type');

	Users.methods.encryptPassword = function(password) 
	{
	    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
	};

	/*Users.virtual('username')
	.set(function(username)
	{
		this.email = username;
	})
	.get(function()
	{
		return this.email;
	})*/

	Users.virtual('userId')
	  .get(function () 
	  {
	      return this.id;
	  }
	);

	Users.virtual('password')
	  .set(function(password) 
	  {
	  	console.log('setting password');
	      this._plainPassword = password;
	      this.salt = crypto.randomBytes(32).toString('base64');
	      //more secure - this.salt = crypto.randomBytes(128).toString('base64');
	      this.hashedPassword = this.encryptPassword(password);//,this);
	  })
	  .get(function() 
	  { 
	    console.log("--- "+this._plainPassword)
	    return this._plainPassword;
	  }
	);
	Users.methods.checkPassword = function(password) 
	{
	    return this.encryptPassword(password) === this.hashedPassword;
	};

	/*Users.path('email').validate(
		function (value, done) 
		{
			mongoose.models["Users"].count({ name: value }, function (error, count) 
			{
			    // Return false if an error is thrown or count > 0
			    done(!(error || count));
			});
		}, 'Users email value is not unique'
	);*/

	mongoose.model('Users', Users);
}
