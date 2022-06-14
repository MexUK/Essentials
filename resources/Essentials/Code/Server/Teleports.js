global.teleports = {};

teleports.path = 'Data/' + util.getCurrentShortGameName() + '/Teleports.xml';

teleports.teleports = [];

// commands
cmds.teleport = (client, _teleportName) =>
{
	if(_teleportName === undefined)
		return chat.pm(client, "You didn't type a teleport name.");
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(teleports.isTeleport(_teleportName))
		return chat.pm(client, "Teleport already exists.");
	
	var teleportName = _teleportName;
	chat.all(client.name + " added teleport " + teleportName + ".");
	
	var position = client.player.vehicle ? client.player.vehicle.position : client.player.position;
	var rotation = client.player.vehicle ? client.player.vehicle.getRotation() : new Vec3(0.0, 0.0, client.player.heading);
	teleports.addTeleport(teleportName, position, rotation);
};

cmds.removeteleport = (client, _teleportName) =>
{
	if(_teleportName === undefined)
		return chat.pm(client, "You didn't type a teleport name.");
	
	if(!teleports.isTeleport(_teleportName))
		return chat.pm(client, 'Teleport not found.');
	
	var teleportName = _teleportName;
	chat.all(client.name + " removed teleport " + teleportName + ".");
	teleports.removeTeleport(teleportName);
};

cmds.teleports = (client) =>
{
	var teleports2 = teleports.teleports.map((v) => v.name);
	if(teleports2.length == 0)
		chat.all('There are no teleports.');
	else
		chat.all('Teleport (' + teleports2.length + '): /' + teleports2.join(' /'));
};

cmds.gototeleport = (client, _teleportName) =>
{
	if(!client.player)
		return chat.notSpawned(client);
	
	if(_teleportName === undefined)
		return chat.pm(client, "You didn't type a teleport name.");
	
	if(!teleports.isTeleport(_teleportName))
		return chat.pm(client, 'Teleport not found.');
	
	var teleportName = _teleportName;
	chat.all(client.name + " teleported to " + teleportName + ".");
	teleports.gotoTeleport(client, teleportName);
};

cmds.updateteleport = (client, _teleportName) =>
{
	if(_teleportName === undefined)
		return chat.pm(client, "You didn't type a teleport name.");
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(!teleports.isTeleport(_teleportName))
		return chat.pm(client, "Teleport doesn't exist.");
	
	var teleportName = _teleportName;
	chat.all(client.name + " updated teleport " + teleportName + ".");
	
	var position = client.player.vehicle ? client.player.vehicle.position : client.player.position;
	var rotation = client.player.vehicle ? client.player.vehicle.getRotation() : new Vec3(0.0, 0.0, client.player.heading);
	teleports.updateTeleport(teleportName, position, rotation);
};







teleports.getPath = () => teleports.path;

teleports.getTeleportData = (name) =>
{
	var nameLower = name.toLowerCase();
	for(var i in teleports.teleports)
	{
		if(nameLower == teleports.teleports[i].name.toLowerCase())
		{
			return teleports.teleports[i];
		}
	}
	return null;
};

teleports.isTeleport = (name) =>
{
	return teleports.getTeleportData(name) != null;
};

teleports.createTeleport = (name, position, rotation) =>
{
	teleports.teleports.push({
		name:		name,
		position:	position,
		rotation:	rotation
	});
};

teleports.addTeleport = (name, position, rotation) =>
{
	teleports.createTeleport(name, position, rotation);
	xml.add(teleports.getPath(), 'Teleport', {
		name:		name,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
};

teleports.removeTeleport = (name) =>
{
	var nameLower = name.toLowerCase();
	for(var i in teleports.teleports)
	{
		if(nameLower == teleports.teleports[i].name.toLowerCase())
		{
			teleports.teleports.splice(i, 1);
			break;
		}
	}
	xml.remove(teleports.getPath(), 'Teleport', 'name', name);
};

teleports.gotoTeleport = (client, name) =>
{
	var data = teleports.getTeleportData(name);
	util.callClientFunction(client, 'generic.setLocalPlayerPositionRotation', data.position, data.rotation);
};

teleports.updateTeleport = (name, position, rotation) =>
{
	var data = teleports.getTeleportData(name);
	data.position = position;
	data.rotation = rotation;
	xml.setAttr(teleports.getPath(), 'Teleport', 'name', name, 'position', util.posArray(position).join(','));
	xml.setAttr(teleports.getPath(), 'Teleport', 'name', name, 'rotation', util.rotArray(rotation, true).join(','));
};






(() =>
{
	xml.load(teleports.getPath(), 'Teleport', (data) => teleports.createTeleport(data.name, util.vec3(data.position), util.vec3Rot(data.rotation, true)));
})();

