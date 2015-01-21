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
	,	'logicSets.js'
	,	'logicItems.js'
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
	,	'libraryFolders.js'
	,	'libraryGroups.js'
	,	'piping.js'
	,	'sessions.js'
	,	'metricResponses.js'
	,	'responseItems.js'
	,	'responseTables.js'
	,	'constructs.js'
	,	'constructItems.js'
	,	'presets.js'
	,	'presetItems.js'
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