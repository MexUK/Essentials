global.resources = {};

// commands
cmds.resources = (client) =>
{
	var resources = getResources();
	chat.all('There ' + util.isAre(resources.length) + ' ' + resources.length + ' ' + util.plural('resoucre', resources.length) + '.');
};

cmds.resourcenames = (client) =>
{
	var resources = getResources();
	if(resources.length == 0)
		chat.all("There aren't any resources running.");
	else
		chat.all('Resource Names: ' + resources.map(resource => resource.name).join(', '));
};

cmds.resourcesstarted = (client) =>
{
	var resources = [];
	getResources().map(resource =>
	{
		if(resource.isStarted)
		{
			resources.push(resource);
		}
	});
	if(resources.length == 0)
		chat.all("There aren't any resources started.");
	else
		chat.all('Resources Started: ' + resources.map(resource => resource.name).join(', '));
};

cmds.resourcesstopped = (client) =>
{
	var resources = [];
	getResources().map(resource =>
	{
		if(!resource.isStarted)
		{
			resources.push(resource);
		}
	});
	if(resources.length == 0)
		chat.all("There aren't any resources started.");
	else
		chat.all('Resources Started: ' + resources.map(resource => resource.name).join(', '));
};

cmds.resourcesstarting = (client) =>
{
	var resources = [];
	getResources().map(resource =>
	{
		if(resource.isStarting)
		{
			resources.push(resource);
		}
	});
	if(resources.length == 0)
		chat.all("There aren't any resources starting.");
	else
		chat.all('Resources Starting: ' + resources.map(resource => resource.name).join(', '));
};

