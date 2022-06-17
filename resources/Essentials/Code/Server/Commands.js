global.commands = {};

commands.defaultCommandLevel = 0;
commands.defaultCommandDisabled = false;
commands.invalidCommandMessageEnabled = true;

commands.paths = {};
commands.paths.commands				= 'Data/Global/Commands.xml';
commands.paths.commandsDumpedXML	= 'Data/Global/Commands Dumped.xml';
commands.paths.commandsDumpedTXT	= 'Data/Global/Commands Dumped.txt';

commands.commands = new Map();




// events
commands.onInvalidCommand = (client, command, parameters) =>
{
	if(!accounts.isClientAuthorized(client))
	{
		chat.pm(client, "Command /"	+ command + " doesn't exist. Please login to use commands, because username " + client.name + " is registered.");
	}
	else if(commands.invalidCommandMessageEnabled)
	{
		chat.pm(client, "Command /"	+ command + " doesn't exist. To find a command, type: /commands search");
	}
};





// commands
cmds.commandlevel = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = util.command(_commandName);
	var level = commands.getLevel(commandName);
	chat.all("Command level for /" + commandName + " is " + level + ".");
};

cmds.setcommandlevel = (client, _commandName, _newLevel) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = util.command(_commandName);
	var oldLevel = commands.getLevel(commandName);
	
	if(_newLevel === undefined)
		return chat.pm(client, "You didn't type a new command level.");
	
	var newLevel = util.int(_newLevel, 0);
	var minNewLevel = -2000000000;
	var maxNewLevel = 2000000000;
	if(newLevel < minNewLevel || newLevel > maxNewLevel)
		return chat.intBetween(client, 'New Command Level', 0, maxNewLevel, _newLevel);
	
	chat.all(client.name + " changed the command level for /" + commandName + " to " + newLevel + " (" + (newLevel >= oldLevel ? "+"+(newLevel-oldLevel) : "-"+(oldLevel-newLevel)) + ")");
	commands.setLevel(commandName, newLevel);
};

cmds.disablecommand = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = util.command(_commandName);
	
	if(commands.isDisabled(commandName))
		return chat.pm(client, 'Command /' + commandName + ' is already disabled.');
	
	chat.all(client.name + " disabled command /" + commandName + ".");
	commands.setDisabled(commandName, true);
};

cmds.enablecommand = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = util.command(_commandName);
	
	if(!commands.isDisabled(commandName))
		return chat.pm(client, 'Command /' + commandName + ' is already enabled.');
	
	chat.all(client.name + " enabled command /" + commandName + ".");
	commands.setDisabled(commandName, false);
};

cmds.disabledcommands = (client) =>
{
	var commands = commands.getDisabledCommands();
	if(commands.length == 0)
		chat.all('All commands are enabled.');
	else
		chat.all("Disabled commands: /" + commands.map(v => v.name).join(' /'));
};

cmds.commandlevels = (client) =>
{
	var commands = [];
	commands.commands.forEach((command) => command.level != commands.defaultCommandLevel && commands.push([command.name, command.level]));
	commands.sort((a,b) => a[1] < b[1]);
	commands = commands.map(v => v[0]+' ('+v[1]+')');
	if(commands.length == 0)
		chat.all('All commands have default admin level.');
	else
		chat.all("Admin commands: /" + commands.join(' /'));
};

cmds.invalidcommandstatus = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => util.isBool(v)
	],
	[
	], _state);
	
	if(_state === undefined)
		return chat.all('The invalid command message status is currently ' + (commands.invalidCommandMessageEnabled ? 'enabled' : 'disabled') + '.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Invalid command message status', _state);
	
	chat.all(client.name + " set the invalid command message status to " + (state ? "on" : "off") + ".");
	commands.invalidCommandMessageEnabled = state;
};

cmds.dumpcommandsxml = (client) =>
{
	var cmds2 = [];
	for(var cmd in cmds)
	{
		cmds2.push({
			name: cmd,
			level: commands.getLevel(cmd)
		});
	}
	
	cmds2.sort((a,b) => b.name < a.name);
	
	chat.all(client.name + ' dumped all the commands to an XML file.');
	xml.save(commands.paths.commandsDumpedXML, 'Command', cmds2, ['name', 'level']);
};

cmds.dumpcommandstxt = (client) =>
{
	var cmds2 = [];
	var cmdsAliases = [];
	for(var cmd in cmds)
	{
		if(commandAliases.isCommandAnAlias(cmd))
		{
			cmdsAliases.push({
				name: cmd,
				level: commands.getLevel(cmd)
			});
		}
		else
		{
			cmds2.push({
				name: cmd,
				level: commands.getLevel(cmd)
			});
		}
	}
	
	cmds2.sort((a,b) => b.name < a.name);
	cmdsAliases.sort((a,b) => b.name < a.name);
	
	var lines = [];
	for(var i in cmds2)
	{
		var cmdData = cmds2[i];
		
		var line = '/' + cmdData.name;
		
		lines.push(line);
	}
	
	lines.push('');
	
	for(var i in cmdsAliases)
	{
		var cmdData = cmdsAliases[i];
		
		var line = '/' + cmdData.name;
		line += ' - Alias of /' + commandAliases.getCommandAliasOf(cmdData.name).original;
		
		lines.push(line);
	}
	
	chat.all(client.name + ' dumped all the commands to a TXT file.');
	util.setFileData(commands.paths.commandsDumpedTXT, lines.join("\r\n"));
};





// bind/unbind
commands.bind = (cmd2, callback) =>
{
	addCommandHandler(cmd2, (cmd,arg,client) =>
	{
		if(cd.get(client, 'registered') && !cd.get(client, 'loggedIn') && cmd.toLowerCase() != 'login')
			return chat.pm(client, "You aren't logged in.");
		
		if(commands.isDisabled(cmd))
			return chat.pm(client, 'Command /' + cmd + ' is disabled.');
		
		if(admin.getClientLevel(client) < commands.getLevel(cmd))
			return chat.pm(client, 'Command /' + cmd + ' requires admin level ' + commands.getLevel(cmd) + '.');
		
		var args = util.cleanSplit(arg);
		args.unshift(client);
		callback.apply(null, args);
	});
};

commands.unbind = (cmd) =>
{
	removeCommandHandler(cmd);
};

commands.create = (commandName, level, disabled) =>
{
	var command =
	{
		name:		commandName,
		level:		level,
		disabled:	disabled
	};
	commands.commands.set(commandName.toLowerCase(), command);
};

// look-up
commands.find = (text) =>
{
	text = commands.getName(text);
	return cmds[text] === undefined ? null : cmds[text];
};

commands.exists = (text) =>
{
	return commands.find(text) !== null;
};

commands.getName = (text) =>
{
	if(text.startsWith('/'))
		text = text.substr(1);
	
	var space = text.indexOf(' ');
	if(space != -1)
		text = text.substr(0, space);
	
	text = text.toLowerCase();
	
	return text;
};

// level
commands.setLevel = (commandName, level) =>
{
	if(!commands.commands.has(commandName.toLowerCase()))
		commands.create(commandName, level);
	var command = commands.commands.get(commandName.toLowerCase());
	command.level = level;
	xml.attr.set(commands.paths.commands, 'Command', 'name', commandName, 'level', level);
};

commands.getLevel = (commandName) =>
{
	var command = commands.commands.get(commandName.toLowerCase());
	if(command)
		return command.level;
	else
		return commands.defaultCommandLevel;
}

commands.removeLevel = (commandName) =>
{
	xml.value.remove(commands.paths.commands, 'Command', 'name', commandName);
}

// disabled
commands.setDisabled = (commandName, disabled) =>
{
	if(!commands.commands.has(commandName.toLowerCase()))
		commands.create(commandName, 0, disabled);
	var command = commands.commands.get(commandName.toLowerCase());
	command.disabled = disabled;
	if(disabled)
		xml.attr.set(commands.paths.commands, 'Command', 'name', commandName, 'disabled', disabled);
	else
		xml.attr.remove(commands.paths.commands, 'Command', 'name', commandName, 'disabled');
};

commands.isDisabled = (commandName) =>
{
	var command = commands.commands.get(commandName.toLowerCase());
	if(command)
		return command.disabled;
	return false;
}

commands.getDisabledCommands = () =>
{
	var commands = [];
	commands.commands.forEach((command) =>
	{
		if(command.disabled)
		{
			commands.push(command);
		}
	});
	return commands;
}

// existence in xml file
commands.checkToRemoveCommandFromFile = (command) =>
{
	if(command.disabled != commands.defaultCommandDisabled)
		return false;
	
	if(command.level != commands.defaultCommandLevel)
		return false;
	
	xml.value.remove(commands.paths.commands, 'Command', 'name', command.name);
	return true;
};




// load
commands.bindAll = () =>
{
	for(var k in cmds)
	{
		commands.bind(k, cmds[k]);
	}
};

setImmediate(() =>
{
	xml.load(commands.paths.commands, 'Command', (data) =>
	{
		commands.create(
			data.name,
			util.int(data.level, commands.defaultCommandLevel),
			util.bool(data.disabled, commands.defaultCommandDisabled)
		);
	});
});