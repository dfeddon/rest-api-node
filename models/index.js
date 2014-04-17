// mongo configs
var remote = '107.170.249.243'; // 15069
var remoteport = 15069;
var local = 'hal3000.local'; // 27017
var localport = 27017
var database = 'metricsdb';

// init mongoose
var mongoose    = require('mongoose');
//var log         = require('./log')(module);

// connect
mongoose.connect('mongodb://derek:immersyve@' + remote + ":" + remoteport + "/metricsdb");
var db = mongoose.connection;

db.on('error', function (err) 
{
    console.log('connection error:', err.message);
});

db.once('open', function callback () 
{
    console.log("Connected to DB!");
});

// instantiate schema
var Schema = mongoose.Schema;

// userPermissions
var UserPermissionsSchema = new Schema(
{
  user:           { type:String, required:true  },
  isOwner:        { type:Boolean, required:true },
  isReader:       { type:Boolean, required:true },
  isEditor:       { type:Boolean, required:true }
});

var MetricLogicSchema = new Schema(
{
  name:           { type:String, required:true},
  description:    { type:String, required:true},
  status:         { type:String, required:true},
  type:           { type:String, required:true},
  operator:       { type:String, required:true},
  components:     { type:String, required:true},
  items:          { type:String, required:true},
});

var MetricConditionsSchema = new Schema(
{
  name:           { type:String, required:true},
  description:    { type:String, required:true},
  status:         { type:String, required:true},
  type:           { type:String, required:true},
});

var MetricItemsSchema = new Schema(
{
  name:           { type:String, required:true},
  description:    { type:String, required:true},
  status:         { type:String, required:true},
  type:           { type:String, required:true},
  value:          { type:String, required:true},
  reverse:        { type:String, required:true},
  required:       { type:String, required:true},
  leftAnchor:     { type:String, required:true},
  rightAnchor:    { type:String, required:true},
  response:       { type:String, required:true},
});

var MetricsSchema = new Schema(
{
  name:           { type:String, required: true },
  description:    { type:String, required: true },
  isImmersyve:    { type:Boolean, required: true },
  variable:       { type:String, required: true },
  required:       { type:Boolean, required: true },
  stem:           { type:String, required: true },
  randomize:      { type:Boolean, required: true },
  reverse:        { type:Boolean, required: true },
  remove:         { type:Number, required: true },
  selected:       { type:Number, required: true },
  randomizeItems: { type:Number, required: true },
  requireAll:     { type:Boolean, required: true },
  visible:        { type:Boolean, required: true },
  keywords:       { type:Array, required: true },
  instructions:   { type:String, required: true },
  response:       { type:String, required: true },
  pipeId:         { type:Number, required: true },
  logic:          [ MetricLogicSchema ],
  type:           { type:String, enum: ["radio","checkbox","dropdown","text","essay","likert","semantic"], required: true },
  items:          { type:Array, required: true },
  conditions:     { type:Array, required: true },
  layout:         { type:String, enum:["horizontal","vertical"], required: true },
  permissions:    [ UserPermissionsSchema ],
  conditions:      {type:Schema.Types.ObjectId, ref:'MetricConditionsSchema'}

});
var MetricsModel = mongoose.model('Metrics', MetricsSchema, "metrics");
module.exports.MetricsModel = MetricsModel;

var MetricGroupsSchema = new Schema(
{
  name:           { type:String, required:true  },
  description:    { type:Boolean, required:true },
  isImmersyve:    { type:Boolean, required:true },
  construct:      { type:Boolean, required:true },
  metrics:        { type:Schema.Types.ObjectId, ref:'MetricsSchema'}
});

// schemas
var Images = new Schema(
{
    kind: 
    {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: 
    { 
      type: String, 
      required: true 
    }
});

var Article = new Schema
(
  {
      title: { type: String, required: true },
      author: { type: String, required: true },
      description: { type: String, required: true },
      images: [Images],
      modified: 
      { 
        type: Date, 
        default: Date.now 
      }
  }
);

// validation
Article.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

var ArticleModel = mongoose.model('Article', Article);

module.exports.ArticleModel = ArticleModel;