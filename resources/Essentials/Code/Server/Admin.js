global.admin = {};

admin.defaultPlayerLevel = 0;

admin.paths = {};
admin.paths.players = 'Data/' + util.getCurrentShortGameName() + '/Players.xml';




// events
events.bind('onPlayerJoined', (event, client) =>
{
	cd.set(client, 'level', xml.attr.get(admin.paths.players, 'Player', 'name', client.name, 'level', admin.defaultPlayerLevel));
});

events.bind('onPlayerCommand', (event, client, command, parameters) =>
{
	if(!commands.exists(command))
		commands.onInvalidCommand(client, command, parameters);
});




// admin commands
cmds.level = (client, _target) =>
{
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var level = admin.getClientLevel(target);
	chat.all("Admin level for " + target.name+" is " + level + ".");
};

cmds.setlevel = (client, _target, _newLevel) =>
{
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var level = admin.getClientLevel(target);
	if(_newLevel === undefined)
		return chat.pm(client, "You didn't type a new player level.");
	
	var newLevel = util.int(_newLevel, 0);
	var minNewLevel = -2000000000;
	var maxNewLevel = 2000000000;
	if(newLevel < minNewLevel || newLevel > maxNewLevel)
		return chat.intBetween(client, 'New Player Level', 0, maxNewLevel, _newLevel);
	
	if(client == target)
		return chat.pm(client, "You can't use this command on your own account.");
	
	if(level >= cd.get(client, 'level'))
		return chat.pm(client, 'Their admin level is either the same or more than yours.');
	
	chat.all(client.name + " changed " + target.name + "'s admin level to " + newLevel + ". (" + (newLevel >= level ? "+"+(newLevel-level) : "-"+(level-newLevel)) + ")");
	admin.setClientLevel(target, newLevel);
};

cmds.admin = (client) =>
{
	var clients = [];
	getClients().forEach((client) => admin.getClientLevel(client) > 0 && clients.push([client.name, admin.getClientLevel(client)]));
	clients.sort((a,b) => a[1] > b[1]);
	clients = clients.map(v => v[0]+' ('+v[1]+')');
	if(clients.length == 0)
		chat.all('There are no admin online.');
	else
		chat.all("Admin online: " + clients.join(', '));
};

cmds.alladmin = (client, _level) =>
{
	var level = util.int(_level, 1);
	
	var names = [];
	xml.load(admin.paths.players, 'Player', (data) =>
	{
		if(util.int(data.level) >= level)
		{
			names.push(data.name + ' (' + data.level + ')');
		}
	});
	
	if(names.length == 0)
		chat.all('There are no admin for level ' + level + ' or higher.');
	else
		chat.all('All admin for level ' + level + ' or higher: ' + names.join(', '));
};





// client level
admin.setClientLevel = (client, level) =>
{
	cd.set(client, 'level', level);
	if(level == admin.defaultPlayerLevel)
		xml.attr.remove(admin.paths.players, 'Player', 'name', client.name, 'level');
	else
		xml.attr.set(admin.paths.players, 'Player', {name: client.name}, {level: level});
};

admin.getClientLevel = (client) =>
{
	return cd.get(client, 'level');
};