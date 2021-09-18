global.resources = {};

// commands
cmds.resources = (client) =>
{
	var resources = getResources();
	chat.all('There ' + util.isAre(resources.length) + ' ' + resources.length + ' ' + util.plural('resoucre', resources.length) + ' running.');
};

cmds.resourcenames = (client) =>
{
	var resources = getResources();
	if(resources.length == 0)
		chat.all("There aren't any resources running.");
	else
		chat.all('Resource Names: ' + resources.map(resource => resource.name).join(', '));
};

