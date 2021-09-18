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

cmds.startresource = (client, _resource) =>
{
	if(_resource === undefined)
		return chat.pm(client, "You didn't type a resource name.");
	
	var resource = findResourceByName(_resource);
	if(!resource)
		return chat.pm(client, "Invalid resource name.");
	
	if(resource.isStarting)
		return chat.pm(client, 'Resource is already starting.');
	
	if(resource.isStarted)
		return chat.pm(client, 'Resource has already started.');
	
	chat.all(client.name + ' started resource ' + resource.name + '.');
	resource.start();
};

cmds.stopresource = (client, _resource) =>
{
	if(_resource === undefined)
		return chat.pm(client, "You didn't type a resource name.");
	
	var resource = findResourceByName(_resource);
	if(!resource)
		return chat.pm(client, "Invalid resource name.");
	
	if(resource.isStarting)
		return chat.pm(client, 'Resource is already starting.');
	
	if(!resource.isStarted)
		return chat.pm(client, 'Resource is already stopped.');
	
	chat.all(client.name + ' stopped resource ' + resource.name + '.');
	resource.stop();
};

cmds.restartresource = (client, _resource) =>
{
	if(_resource === undefined)
		return chat.pm(client, "You didn't type a resource name.");
	
	var resource = findResourceByName(_resource);
	if(!resource)
		return chat.pm(client, "Invalid resource name.");
	
	if(resource.isStarting)
		return chat.pm(client, 'Resource is already starting.');
	
	chat.all(client.name + ' restarted resource ' + resource.name + '.');
	
	if(resource.isStarted)
		resource.stop();
	
	if(!resource.isStarted)
		resource.start();
};

