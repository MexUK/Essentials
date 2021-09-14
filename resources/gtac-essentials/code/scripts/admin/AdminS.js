global.admin = {};

admin.defaultPlayerLevel = 0;
admin.defaultCommandLevel = 0;

admin.paths = {};
admin.paths.players = 'data/scripts/admin/Players.xml';
admin.paths.commands = 'data/scripts/admin/Commands.xml';

admin.commands = new Map();

// events
events.onPlayerJoined.push((event, client) =>
{
	clientData.set(client, 'level', xml.getAttr(admin.paths.players, 'Player', 'name', client.name, 'Level', admin.defaultPlayerLevel));
});

// commands
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
	
	if(level >= clientData.get(client, 'level'))
		return chat.pm(client, 'Their admin level is either the same or more than yours.');
	
	chat.all(client.name + " changed " + target.name + "'s admin level to " + newLevel + ". (" + (newLevel >= level ? "+"+(newLevel-level) : "-"+(level-newLevel)) + ")");
	admin.setClientLevel(target, newLevel);
};

cmds.commandlevel = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!util.isCommand(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = _commandName;
	var level = admin.getCommandLevel(commandName);
	chat.all("Command level for /" + commandName + " is " + level + ".");
};

cmds.setcommandlevel = (client, _commandName, _newLevel) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!util.isCommand(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = _commandName;
	var oldLevel = admin.getCommandLevel(commandName);
	
	if(_newLevel === undefined)
		return chat.pm(client, "You didn't type a new command level.");
	
	var newLevel = util.int(_newLevel, 0);
	var minNewLevel = -2000000000;
	var maxNewLevel = 2000000000;
	if(newLevel < minNewLevel || newLevel > maxNewLevel)
		return chat.intBetween(client, 'New Command Level', 0, maxNewLevel, _newLevel);
	
	chat.all(client.name + " changed the command level for /" + commandName + " to " + newLevel + " (" + (newLevel >= oldLevel ? "+"+(newLevel-oldLevel) : "-"+(oldLevel-newLevel)) + ")");
	admin.setCommandLevel(commandName, newLevel);
};

cmds.disablecommand = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!util.isCommand(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = _commandName;
	
	if(admin.isCommandDisabled(commandName))
		return chat.pm(client, 'Command /' + commandName + ' is already disabled.');
	
	chat.all(client.name + " disabled command /" + commandName + ".");
	admin.setCommandDisabled(commandName, true);
};

cmds.enablecommand = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!util.isCommand(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = _commandName;
	
	if(!admin.isCommandDisabled(commandName))
		return chat.pm(client, 'Command /' + commandName + ' is already enabled.');
	
	chat.all(client.name + " enabled command /" + commandName + ".");
	admin.setCommandDisabled(commandName, false);
};

cmds.disabledcommands = (client) =>
{
	var commands = admin.getDisabledCommands();
	if(commands.length == 0)
		chat.all('All commands are enabled.');
	else
		chat.all("Disabled commands: /" + commands.map(v => v.name).join(' /'));
};

cmds.commandlevels = (client) =>
{
	var commands = [];
	admin.commands.forEach((command) => command.level != admin.defaultCommandLevel && commands.push([command.name, command.level]));
	commands.sort((a,b) => a[1] < b[1]);
	commands = commands.map(v => v[0]+' ('+v[1]+')');
	if(commands.length == 0)
		chat.all('All commands have default admin level.');
	else
		chat.all("Admin commands: /" + commands.join(' /'));
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









admin.setCommandLevel = (commandName, level) =>
{
	if(!admin.commands.has(commandName.toLowerCase()))
		admin.createCommand(commandName, level);
	var command = admin.commands.get(commandName.toLowerCase());
	command.level = level;
	if(admin.checkToRemoveCommandFromFile(command))
		return;
	else if(level == admin.defaultCommandLevel)
		xml.removeAttr(admin.paths.commands, 'Command', 'name', commandName, 'level');
	else
		xml.setAttr(admin.paths.commands, 'Command', 'name', commandName, 'level', level);
};

admin.getCommandLevel = (commandName) =>
{
	var command = admin.commands.get(commandName.toLowerCase());
	if(command)
		return command.level;
	else
		return admin.defaultCommandLevel;
}

admin.setCommandDisabled = (commandName, disabled) =>
{
	if(!admin.commands.has(commandName.toLowerCase()))
		admin.createCommand(commandName, 0, disabled);
	var command = admin.commands.get(commandName.toLowerCase());
	command.disabled = disabled;
	if(admin.checkToRemoveCommandFromFile(command))
		return;
	else if(disabled)
		xml.setAttr(admin.paths.commands, 'Command', 'name', commandName, 'disabled', disabled);
	else
		xml.removeAttr(admin.paths.commands, 'Command', 'name', commandName, 'disabled');
};

admin.isCommandDisabled = (commandName) =>
{
	var command = admin.commands.get(commandName.toLowerCase());
	if(command)
		return command.disabled;
	return false;
}

admin.getDisabledCommands = () =>
{
	var commands = [];
	admin.commands.forEach((command) =>
	{
		if(command.disabled)
		{
			commands.push(command);
		}
	});
	return commands;
}

admin.checkToRemoveCommandFromFile = (command) =>
{
	if(command.disabled)
		return false;
	
	if(command.level != admin.defaultCommandLevel)
		return false;
	
	xml.remove(admin.paths.commands, 'Command', 'name', command.name);
	return true;
};

admin.createCommand = (commandName, level, disabled) =>
{
	var command =
	{
		name:		commandName,
		level:		level,
		disabled:	disabled
	};
	admin.commands.set(commandName.toLowerCase(), command);
};





admin.setClientLevel = (client, level) =>
{
	clientData.set(client, 'level', level);
	if(level == admin.defaultPlayerLevel)
		xml.removeAttr(admin.paths.players, 'Player', 'name', client.name, 'level');
	else
		xml.setAttr(admin.paths.players, 'Player', 'name', client.name, 'level', level);
};

admin.getClientLevel = (client) =>
{
	return clientData.get(client, 'level');
};




xml.load(admin.paths.commands, 'Command', (data) => admin.createCommand(data.name, util.int(data.level, admin.defaultCommandLevel), util.bool(data.disabled, false)));

