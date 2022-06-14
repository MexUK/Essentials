global.playerKeyBinds = {};

playerKeyBinds.path = 'Data/' + util.getCurrentShortGameName() + '/PlayerKeyBinds.xml';

// events
events.onPlayerLogin.push((event, client) =>
{
	var nameLower = client.name.toLowerCase();
	xml.load(playerKeyBinds.path, 'Key', (v) =>
	{
		if(nameLower == v.name.toLowerCase())
		{
			playerKeyBinds.createKeyBind(client, v.key, v.command, v.args.length == 0 ? '' : v.args.split(' '));
		}
	});
});

events.onPlayerLogout.push((event, client) =>
{
	playerKeyBinds.destroyAllKeyBinds(client);
});

playerKeyBinds.onClientKeyDown = (client, keyCode) =>
{
	if(!accounts.isClientAuthorized(client))
		return;

	var key = String.fromCharCode(keyCode);
	
	if(!util.isKey(key))
		return;
	
	if(!playerKeyBinds.isKeyBound(client, key))
		return;
	
	var [command, args] = playerKeyBinds.getBoundCommand(client, key);
	cmds[command.toLowerCase()](client, ...args);
};

// commands
cmds.key = (client, _key, _cmd, ...args) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, _key);
	
	var key = util.key(_key);
	
	if(_cmd === undefined)
	{
		var data = playerKeyBinds.getBoundCommand(client, key);
		if(data)
		{
			var [command, args] = data;
			return chat.all(client.name + " has command /" + command + (args.length == 0 ? '' : (' ' + args.join(' '))) + " bound to key " + key + ".");
		}
		else
		{
			return chat.all(client.name + " doesn't have a command bound to key " + key + ".");
		}
	}
	
	var cmd = util.command(_cmd);
	
	if(!commands.exists(cmd))
		return chat.invalidCommand(client, _cmd);
	
	chat.all(client.name + " binded " + key + " key to command /" + cmd + (args.length == 0 ? '' : (' ' + args.join(' '))));
	playerKeyBinds.bindKey(client, key, cmd, args);
};

cmds.unkey = (client, _key) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, _key);
	
	var key = util.key(_key);
	
	if(!playerKeyBinds.isKeyBound(client, key))
		return chat.pm(client, "You don't have key " + key + " bound to a command.");
	
	var [command, args] = playerKeyBinds.getBoundCommand(client, key);
	chat.all(client.name + " unbinded " + key + " key from command /" + command + (args.length == 0 ? '' : (' ' + args.join(' '))) + ".");
	playerKeyBinds.unbindKey(client, key);
};

cmds.keys = (client) =>
{
	var keys = playerKeyBinds.getBoundKeys(client);
	
	if(keys.length == 0)
		chat.all(client.name + " doesn't have any keys bound to a command.");
	else
		chat.all(client.name + " has keys bound: " + keys.map(v => v[0]).join(' '));
};







playerKeyBinds.createKeyBind = (client, key, cmd, args) =>
{
	cd.setmap(client, 'keys', key, [cmd, args]);
};

playerKeyBinds.destroyKeyBind = (client, key) =>
{
	cd.unsetmap(client, 'keys', key);
};

playerKeyBinds.destroyAllKeyBinds = (client) =>
{
	cd.clearmap(client, 'keys');
};

playerKeyBinds.bindKey = (client, key, cmd, args) =>
{
	playerKeyBinds.createKeyBind(client, key, cmd, args);
	xml.setAttr2(playerKeyBinds.path, 'Key', {
		name:		client.name,
		key:		key
	}, {
		command:	cmd,
		args:		(args.length == 0 ? '' : args.join(' '))
	});
};

playerKeyBinds.unbindKey = (client, key) =>
{
	cd.unsetmap(client, 'keys', key);
	xml.removeAttr2(playerKeyBinds.path, 'Key', {
		name:		client.name,
		key:		key
	});
};

playerKeyBinds.isKeyBound = (client, key) =>
{
	return cd.hasmap(client, 'keys', key);
};

playerKeyBinds.getBoundKeys = (client) =>
{
	var keys = [];
	cd.getmapcontainer(client, 'keys').forEach((v,k) => keys.push([k,v]));
	return keys;
};

playerKeyBinds.getBoundCommand = (client, key) =>
{
	return cd.getmap(client, 'keys', key);
};