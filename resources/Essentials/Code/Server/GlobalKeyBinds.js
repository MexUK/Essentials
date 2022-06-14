global.globalKeyBinds = {};

globalKeyBinds.binds = new Map();
globalKeyBinds.path = 'Data/' + ['UnknownGame','III','VC','SA'][server.game] + '/GlobalKeyBinds.xml';

// events
globalKeyBinds.onClientKeyDown = (client, keyCode) =>
{
	var key = String.fromCharCode(keyCode);
	
	if(!util.isKey(key))
		return;
	
	if(!globalKeyBinds.isKeyBound(key))
		return;
	
	var [command, args] = globalKeyBinds.getBoundCommand(key);
	cmds[command.toLowerCase()](client, ...args);
};

// commands
cmds.gkey = (client, _key, _cmd, ...args) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, _key);
	
	var key = util.key(_key);
	
	if(_cmd === undefined)
	{
		var data = globalKeyBinds.getBoundCommand(key);
		if(data)
		{
			var [command, args] = data;
			return chat.all("Command /" + command + (args.length == 0 ? '' : (' ' + args.join(' '))) + " is globally bound to key " + key + ".");
		}
		else
		{
			return chat.all("There isn't a command globally bound to key " + key + ".");
		}
	}
	
	var cmd = util.command(_cmd);
	
	if(!util.isCommand(cmd))
		return chat.invalidCommand(client, _cmd);
	
	chat.all(client.name + " globally binded " + key + " key to command /" + cmd + (args.length == 0 ? '' : (' ' + args.join(' '))));
	globalKeyBinds.bindKey(key, cmd, args);
};

cmds.ungkey = (client, _key) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, _key);
	
	var key = util.key(_key);
	
	if(!globalKeyBinds.isKeyBound(key))
		return chat.pm(client, "Key " + key + " is not globally bound to a command.");
	
	var [command, args] = globalKeyBinds.getBoundCommand(key);
	chat.all(client.name + " globally unbinded " + key + " key from command /" + command + (args.length == 0 ? '' : (' ' + args.join(' '))) + ".");
	globalKeyBinds.unbindKey(key);
};

cmds.gkeys = (client) =>
{
	var keys = globalKeyBinds.getBoundKeys();
	
	if(keys.length == 0)
		chat.all("There aren't any keys globally bound to a command.");
	else
		chat.all("Keys globally bound: " + keys.map(v => v[0]).join(' '));
};







globalKeyBinds.createKeyBind = (key, cmd, args) =>
{
	globalKeyBinds.binds.set(key, [cmd, args]);
};

globalKeyBinds.bindKey = (key, cmd, args) =>
{
	globalKeyBinds.createKeyBind(key, cmd, args);
	xml.setAttr2(globalKeyBinds.path, 'Key', {
		key:		key
	}, {
		command:	cmd,
		args:		(args.length == 0 ? '' : args.join(' '))
	});
};

globalKeyBinds.unbindKey = (key) =>
{
	globalKeyBinds.binds.delete(key);
	xml.removeAttr2(globalKeyBinds.path, 'Key', {
		key:		key
	});
};

globalKeyBinds.isKeyBound = (key) =>
{
	return globalKeyBinds.binds.has(key);
};

globalKeyBinds.getBoundKeys = () =>
{
	var keys = [];
	globalKeyBinds.binds.forEach((v,k) => keys.push([k,v]));
	return keys;
};

globalKeyBinds.getBoundCommand = (key) =>
{
	return globalKeyBinds.binds.get(key);
};




xml.load(globalKeyBinds.path, 'Key', (v) =>
{
	globalKeyBinds.createKeyBind(v.key, v.command, v.args.split(' '));
});

