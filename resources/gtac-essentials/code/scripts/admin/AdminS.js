global.admin = {};

admin.path = 'data/scripts/Admin/Admin';

// events
events.onPlayerJoined.push((event, client) =>
{
	clientData.set(client, 'level', xml.getAttr(admin.path, client.name, 'Level'));
});

// commands
cmds.level = (client, _target, _newLevel) =>
{
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var level = clientData.get(target, 'level');
	if(_newLevel === undefined)
		return chat.all(target.name+"'s admin level: "+level);
	
	var newLevel = util.int(_newLevel, 0);
	var minNewLevel = -2000000000;
	var maxNewLevel = 2000000000;
	if(newLevel < minNewLevel || newLevel > maxNewLevel)
		return chat.intBetween(client, 'New Level', 0, maxNewLevel, _newLevel);
	
	if(client != target && level >= clientData.get(client, 'level'))
		return chat.pm(client, 'Their admin level is either the same or more than yours.');
	
	chat.all(client.name + " changed " + target.name + "'s admin level to " + newLevel + " (" + (newLevel >= level ? "+"+(newLevel-level) : "-"+(level-newLevel)) + ")");
	clientData.set(target, 'level', newLevel);
};

cmds.clevel = (client, _cmd, _newLevel) =>
{
	var cmd = util.isCommand(_cmd);
	if(!cmd)
		return chat.invaliCommand(client, _cmd);
	
	var level = clientData.get(target, 'level');
	if(_newLevel === undefined)
		return chat.all("Command admin level for /"+cmd+" is "+level);
	
	var newLevel = util.int(_newLevel, 0);
	var minNewLevel = -2000000000;
	var maxNewLevel = 2000000000;
	if(newLevel < minNewLevel || newLevel > maxNewLevel)
		return chat.intBetween(client, 'New Level', 0, maxNewLevel, _newLevel);
	
	chat.all(client.name + " changed the command admin level for /" + cmd + "'s admin level to " + newLevel + " (" + (newLevel >= level ? "+"+(newLevel-level) : "-"+(level-newLevel)) + ")");
};