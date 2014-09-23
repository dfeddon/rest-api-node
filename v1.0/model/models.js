var models = 
[
		'userPermissions.js'
	,	'permissions.js'
	,	'clients.js'
	,	'accessToken.js'
	,	'refreshToken.js'
	,	'logic.js' 
	,	'metricConditions.js'
	,	'tableItems.js'
	,	'metricPresets.js'
	,	'metricItems.js'
	,	'logicSets'
	,	'logicItems'
	,	'metrics.js'
	,	'metricGroups.js'
	,	'organizations.js'
	,	'users.js'
	,	'pages.js'
	,	'surveys.js'
	,	'projects.js'
	,	'products.js'
	,	'iterations.js'
	,	'studies.js'
	,	'libraryGroups.js'
	,	'piping'
	,	'triggers.js'
];
exports.initialize = function()
{
	var len = models.length;
	for (var i = 0; i < len; i++)
	{
		require('./models/' + models[i])();
	}
}