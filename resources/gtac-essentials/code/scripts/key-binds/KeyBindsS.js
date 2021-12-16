global.keyBinds = {};

keyBinds.path = 'data/scripts/key-binds/KeyBinds.xml';

// events
events.onPlayerJoined.push((event, client) =>
{
	var nameLower = client.name.toLowerCase();
	xml.load(keyBinds.path, 'Key', (v) =>
	{
		if(nameLower == v.name.toLowerCase())
		{
			keyBinds.createKeyBind(client, v.key, v.command, v.args.split(' '));
		}
	});
});

keyBinds.onClientKeyDown = (client, keyCode) =>
{
	var key = String.fromCharCode(keyCode);
	
	if(!util.isKey(key))
		return;
	
	if(!keyBinds.isKeyBound(client, key))
		return;
	
	var [command, args] = keyBinds.getBoundCommand(client, key);
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
		var data = keyBinds.getBoundCommand(client, key);
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
	
	if(!util.isCommand(cmd))
		return chat.invalidCommand(client, _cmd);
	
	chat.all(client.name + " binded " + key + " key to command /" + cmd + (args.length == 0 ? '' : (' ' + args.join(' '))));
	keyBinds.bindKey(client, key, cmd, args);
};

cmds.unkey = (client, _key) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, _key);
	
	var key = util.key(_key);
	
	if(!keyBinds.isKeyBound(client, key))
		return chat.pm(client, "You don't have key " + key + " bound to a command.");
	
	var [command, args] = keyBinds.getBoundCommand(client, key);
	chat.all(client.name + " unbinded " + key + " key from command /" + command + (args.length == 0 ? '' : (' ' + args.join(' '))) + ".");
	keyBinds.unbindKey(client, key);
};

cmds.keys = (client) =>
{
	var keys = keyBinds.getBoundKeys(client);
	
	if(keys.length == 0)
		chat.all(client.name + " doesn't have any keys bound to a command.");
	else
		chat.all(client.name + " has keys bound: " + keys.map(v => v[0]).join(' '));
};







keyBinds.createKeyBind = (client, key, cmd, args) =>
{
	clientData.setmap(client, 'keys', key, [cmd, args]);
};

keyBinds.bindKey = (client, key, cmd, args) =>
{
	keyBinds.createKeyBind(client, key, cmd, args);
	xml.setAttr2(keyBinds.path, 'Key', {
		name:		client.name,
		key:		key
	}, {
		command:	cmd,
		args:		(args.length == 0 ? '' : args.join(' '))
	});
};

keyBinds.unbindKey = (client, key) =>
{
	clientData.unsetmap(client, 'keys', key);
	xml.removeAttr2(keyBinds.path, 'Key', {
		name:		client.name,
		key:		key
	});
};

keyBinds.isKeyBound = (client, key) =>
{
	return clientData.hasmap(client, 'keys', key);
};

keyBinds.getBoundKeys = (client) =>
{
	var keys = [];
	clientData.getmapcontainer(client, 'keys').forEach((v,k) => keys.push([k,v]));
	return keys;
};

keyBinds.getBoundCommand = (client, key) =>
{
	return clientData.getmap(client, 'keys', key);
};


