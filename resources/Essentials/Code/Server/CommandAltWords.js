global.commandAltWords = {};

commandAltWords.path = 'Data/Global/CommandAltWords.xml';
commandAltWords.words = [];

// events
events.bind('onPlayerCommand', (event, client, command, parameters) =>
{
	if(!commands.exists(command))
		commandAltWords.onInvalidCommand(client, command, parameters);
});

commandAltWords.onInvalidCommand = (client, command, parameters) =>
{
	if(!accounts.isClientAuthorized(client))
	{
		return;
	}

	let originalCommand = commandAltWords.getCommandMatch(command);
	if(originalCommand)
	{
		commands.trigger(originalCommand, client, parameters.split(/\s+/g));
		return;
	}
};

setImmediate(() => commandAltWords.loadAlts());

// commands
cmds.commandaltwords = (client) =>
{
	if(commandAltWords.words.length == 0)
		chat.all('There are no command alternative words.');
	else
		chat.all('Command alternative words ('+commandAltWords.words.length+'): ' + commandAltWords.words.map(v => v[0]+' -> '+v[1]).join(', '));
};

cmds.commandaltword = (client, find) =>
{
	if(find === undefined)
		return chat.pm(client, "You didn't type a word to find in command names.");
	
	let alts = commandAltWords.getWordMatches(find);
	if(alts.length == 0)
		chat.all('There are no command alternative words for \''+find+'\'.');
	else
		chat.all('Command alternative words for \''+find+'\': '+alts.join(' '));
};

cmds.addcommandaltword = (client, find, alt) =>
{
	if(find === undefined)
		return chat.pm(client, "You didn't type a word to find in command names.");
	
	if(alt === undefined)
		return chat.pm(client, "You didn't type an alternative word.");
	
	if(find.toLowerCase() == alt.toLowerCase())
		return chat.pm(client, "The command find word cannot be the same as the alternative word.");

	if(commandAltWords.isAlt(find, alt))
		return chat.pm(client, alt+" is already an alternative word for "+find);
	
	commandAltWords.addAlt(find, alt);
	chat.all(client.name + " added command word " + find + " with alternative word " + alt + ".");
};

cmds.removecommandaltword = (client, find, alt) =>
{
	if(find === undefined)
		return chat.pm(client, "You didn't type a word to find in command names.");
	
	if(alt === undefined)
		return chat.pm(client, "You didn't type an alternative word.");
	
	if(find.toLowerCase() == alt.toLowerCase())
		return chat.pm(client, "The command find word cannot be the same as the alternative word.");

	if(!commandAltWords.isAlt(find, alt))
		return chat.pm(client, alt+" is not an alternative word for "+find);
	
	commandAltWords.removeAlt(find, alt);
	chat.all(client.name + " removed command word " + find + " with alternative word " + alt + ".");
};

// model
commandAltWords.isAlt = (find, alt) =>
{
	find = find.toLowerCase();
	alt = alt.toLowerCase();

	for(var i in commandAltWords.words)
	{
		let [find2, alt2] = commandAltWords.words[i];
		if(find === find2.toLowerCase() && alt === alt2.toLowerCase())
		{
			return true;
		}
	}
	
	return false;
};

commandAltWords.createAlt = (find, alt) =>
{
	commandAltWords.words.push([find, alt]);
};

commandAltWords.destroyAlt = (find, alt) =>
{
	find = find.toLowerCase();
	alt = alt.toLowerCase();
	var index = -1;
	for(var i in commandAltWords.words)
	{
		if(find == commandAltWords.words[i][0].toLowerCase()
		&& alt == commandAltWords.words[i][1].toLowerCase())
		{
			index = i;
			break;
		}
	}
	if(index == -1)
		return;
	
	commandAltWords.words.splice(index, 1);
};

commandAltWords.addAlt = (find, alt) =>
{
	commandAltWords.createAlt(find, alt);
	xml.element.add(commandAltWords.path, 'Alt', {
		find: find,
		alt: alt
	});
};

commandAltWords.removeAlt = (find, alt) =>
{
	commandAltWords.destroyAlt(find, alt);
	xml.element.remove(commandAltWords.path, 'Alt', {
		find: find,
		alt: alt
	});
};

commandAltWords.loadAlts = () =>
{
	xml.load(commandAltWords.path, 'Alt', (data) => commandAltWords.createAlt(data.find, data.alt));
};

commandAltWords.getCommandMatch = (command) =>
{
	let commandLower = command.toLowerCase();

	for(let i in commandAltWords.words)
	{
		let [find,replace] = commandAltWords.words[i];

		find = find.toLowerCase();

		if(commandLower.indexOf(replace) != -1)
		{
			replace = replace.toLowerCase();

			for(let i2 in commandAltWords.words)
			{
				let [find2,replace2] = commandAltWords.words[i2];

				find2 = find2.toLowerCase();

				if(commandLower.indexOf(replace2) != -1)
				{
					replace2 = replace2.toLowerCase();

					for(let k in cmds)
					{
						let cmd = k.toLowerCase();

						cmd = cmd.replace(new RegExp(find, 'g'), replace);
						cmd = cmd.replace(new RegExp(find2, 'g'), replace2);

						if(commandLower === cmd)
						{
							return k;
						}
					}
				}
			}
		}
	}

	return null;
};