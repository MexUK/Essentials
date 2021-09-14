global.keyBinds = {};

// events
events.onKeyDown.push((event, client, key) =>
{
	
});

// commands
cmds.key = (client, _key, _cmd) =>
{
	if(!util.isKey(_key))
		return chat.invalidKey(client, key);
	
	if(!cmds[_cmd])
		return chat.invalidCommand(client, _cmd);
	
	chat.all(client.name + " binded " + _key + " key to command /" + _cmd);
	clientData.setmap(client, 'keys', _key, _cmd);
};

cmds.unkey = (client, _key) =>
{
	chat.all(client.name + " unbinded " + _key + " key from command /" + _cmd);
	clientData.unsetmap(client, 'keys', _key);
};

cmds.keys = (client, _key) =>
{
	chat.all(client.name + " unbinded " + _key + " key from command /" + _cmd);
	clientData.unsetmap(client, 'keys', _key);
};