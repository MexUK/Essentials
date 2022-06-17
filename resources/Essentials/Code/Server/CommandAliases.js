global.commandAliases = {};

commandAliases.path = 'Data/Global/CommandAliases.xml';

commandAliases.commandAliases = [];

// commands
cmds.commandalias = (client, _commandName, _commandAlias) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = commands.getName(_commandName);
	if(_commandAlias === undefined)
	{
		var commandIsAnAlias = commandAliases.isCommandAnAlias(commandName);
		var commandAliasOf = commandAliases.getCommandAliasOf(commandName);
		
		var aliasesForCommand = commandAliases.getCommandAliases(commandName);
		aliasesForCommand = aliasesForCommand.map((v) => v.clone);
		
		if(aliasesForCommand.length == 0 && !commandIsAnAlias)
			return chat.all("Command /" + commandName + " is not an alias of any command, and does not have any command aliases.");
		else if(aliasesForCommand.length == 0)
			return chat.all("Command /" + commandName + " is an alias of command /" + commandAliasOf.original + ", and does not have any command aliases.");
		else
			return chat.all("Command /" + commandName + " is not an alias of any command, and has command aliases: /" + aliasesForCommand.join(' /'));
	}
	
	if(commands.exists(_commandAlias))
		return chat.pm(client, 'Command /' + _commandAlias + ' already exists.');
	
	var commandAlias = commands.getName(_commandAlias);
	chat.all(client.name + " added command alias /" + commandAlias + " for command /" + commandName + ".");
	
	commandAliases.addCommandAlias(commandName, commandAlias);
};

cmds.removecommandalias = (client, _commandName) =>
{
	if(_commandName === undefined)
		return chat.pm(client, "You didn't type a command name.");
	
	if(!commands.exists(_commandName))
		return chat.pm(client, 'Command not found.');
	
	var commandName = commands.getName(_commandName);
	var commandIsAnAlias = commandAliases.isCommandAnAlias(commandName);
	if(!commandIsAnAlias)
		return chat.pm(client, 'Command /' + commandName + ' is not an alias of any command.');
	
	var commandAliasOf = commandAliases.getCommandAliasOf(commandName);
	chat.all(client.name + " removed command alias /" + commandName + " from command /" + commandAliasOf.original + ".");
	
	commandAliases.removeCommandAlias(commandName);
};

cmds.commandaliases = (client) =>
{
	var aliases = commandAliases.commandAliases.map((v) => '/' + v.clone + ' (/' + v.original + ')');
	if(aliases.length == 0)
		chat.all('There are no command aliases.');
	else
		chat.all('Command aliases: ' + aliases.join(' '));
};





commandAliases.getCommandAliases = (commandName) =>
{
	var commandNameLower = commandName.toLowerCase();
	var aliases = [];
	for(var i in commandAliases.commandAliases)
	{
		var commandAlias = commandAliases.commandAliases[i];
		if(commandNameLower == commandAlias.original.toLowerCase())
		{
			aliases.push(commandAlias);
		}
	}
	return aliases;
};

commandAliases.getCommandAliasOf = (commandName) =>
{
	var commandNameLower = commandName.toLowerCase();
	var aliases = [];
	for(var i in commandAliases.commandAliases)
	{
		var commandAlias = commandAliases.commandAliases[i];
		if(commandNameLower == commandAlias.clone.toLowerCase())
		{
			return commandAlias;
		}
	}
	return null;
};

commandAliases.isCommandAnAlias = (commandName) =>
{
	return commandAliases.getCommandAliasOf(commandName) != null;
};

commandAliases.createCommandAlias = (originalName, cloneName) =>
{
	cmds[cloneName] = cmds[originalName];
	commands.bind(cloneName, cmds[originalName]);
};

commandAliases.destroyCommandAlias = (cloneName) =>
{
	delete cmds[cloneName];
	commands.unbind(cloneName);
};

commandAliases.addCommandAlias = (originalName, cloneName) =>
{
	commandAliases.createCommandAlias(originalName, cloneName);
	commandAliases.commandAliases.push({
		original: originalName,
		clone: cloneName
	});
	xml.add(commandAliases.path, 'Command', {
		original: originalName,
		clone: cloneName
	});
	
	if(global.admin)
	{
		commands.setLevel(cloneName, commands.getLevel(originalName));
	}
};

commandAliases.removeCommandAlias = (cloneName) =>
{
	var cloneNameLower = cloneName.toLowerCase();
	commandAliases.destroyCommandAlias(cloneName);
	for(var i in commandAliases.commandAliases)
	{
		if(cloneNameLower == commandAliases.commandAliases[i].clone.toLowerCase())
		{
			commandAliases.commandAliases.splice(i, 1);
			break;
		}
	}
	xml.remove(commandAliases.path, 'Command', 'clone', cloneName);
	
	if(admin)
	{
		commands.removeLevel(cloneName);
	}
};






setImmediate(() =>
{
	var root = util.loadXMLRoot(commandAliases.path);
	commandAliases.commandAliases = util.getXMLArray(root, 'Command', (v) => v);
	commandAliases.commandAliases.forEach(v => commandAliases.createCommandAlias(v.original, v.clone));
});

