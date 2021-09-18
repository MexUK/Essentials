global.spawn = {};

spawn.spawnsPath = 'data/scripts/spawn-and-respawn/{0}/Spawns.xml';
spawn.dataPath = 'data/scripts/spawn-and-respawn/{0}/SpawnData.xml';

spawn.spawns = [];
spawn.gameFolderNames =
[
	'unknown',
	'iii',
	'vc',
	'sa',
	'iv'
];

// events
var cb1 = (e,c) => {
	if(generic.spawnHealth === undefined || generic.spawnArmour === undefined)
	{
		setTimeout(cb1, 250);
		return;
	}
	
	clientData.set(c, 'playerModel', util.getRandomPedModel());
	spawn.spawnPlayer(c);
};
events.onPlayerJoined.push(cb1);

events.onPedWasted.push((e,p,a,w,pp) => {
	if(!p.isType(ELEMENT_PLAYER))
		return;
	
	var c = getClientFromPlayerElement(p);
	clientData.set(c, 'playerModel', p.modelIndex);
	
	util.clientTimer(c, function()
	{
		spawn.spawnPlayer(c);
	}, spawn.respawnDuration);
});

// commands
/*
cmds.spawn = (client) =>
{
	if(client.player)
		return chat.pm(client, 'You are already spawned.');
	
	chat.all(client.name + " spawned themself.");
	spawn.spawnPlayer(client);
};

cmds.despawn = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	chat.all(client.name + " despawned themself.");
	util.callClientFunction(client, 'spawn.despawnLocalPlayer');
};

cmds.respawn = (client) =>
{
	chat.all(client.name + " respawned themself.");
	
	if(client.player)
		util.callClientFunction(client, 'spawn.despawnLocalPlayer');
	if(!client.player)
		spawn.spawnPlayer(client);
};
*/

cmds.addspawn = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var spawnId = spawn.addSpawn(client.player.position, client.player.heading);
	chat.all(client.name + ' added a spawn position. (Spawn ID ' + spawnId + ')');
};

cmds.removespawn = (client, _spawnId) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var spawnId = util.int(_spawnId);
	
	if(_spawnId === undefined)
	{
		var positions = spawn.spawns.map((position,i) => [position, i, client.player.position.distance(position)]);
		
		if(positions.length == 0)
			return chat.pm(client, 'There are no spawn positions.');
		
		var maxDistanceAway = 5.0;
		positions.sort((a,b) => a[2] > b[2]);
		
		var position = positions[0][0];
		var distanceAway = positions[0][2];
		if(distanceAway > maxDistanceAway)
			return chat.pm(client, 'There are no spawn positions near you.');
		
		chat.all(client.name + ' removed spawn position with ID ' + positions[0][1] + '.');
		spawn.removeSpawn(positions[0][1]);
		return;
	}
	
	if(!spawn.isSpawnId(spawnId))
		return chat.pm(client, 'Invalid spawn ID.');
	
	chat.all(client.name + ' removed spawn position with ID ' + spawnId + '.');
	spawn.removeSpawn(spawnId);
};

cmds.spawns = (client) =>
{
	if(spawn.spawns.length == 0)
		chat.all('There are no spawn positions.');
	else
		chat.all('There ' + util.isAre(spawn.spawns.length) + ' ' + spawn.spawns.length + ' spawn ' + util.plural('position', spawn.spawns.length) + '.');
};

cmds.spawnids = (client) =>
{
	if(spawn.spawns.length == 0)
		chat.all('There are no spawn positions.');
	else
		chat.all('Spawn position IDs: ' + spawn.spawns.map(spawn => spawn.id).join(' ') + '.');
};

cmds.gotospawn = (client, _spawnId) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var spawnId = util.int(_spawnId);
	
	if(_spawnId === undefined)
		return chat.pm(client, "You didn't type a spawn ID.");
	
	if(!spawn.isSpawnId(spawnId))
		return chat.pm(client, 'Invalid spawn ID.');
	
	chat.all(client.name + ' teleported to spawn ID ' + spawnId + '.');
	spawn.teleportClientToSpawn(client, spawnId);
};

cmds.savespawn = (client, _spawnId) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var spawnId = util.int(_spawnId);
	
	if(_spawnId === undefined)
		return chat.pm(client, "You didn't type a spawn ID.");
	
	if(!spawn.isSpawnId(spawnId))
		return chat.pm(client, 'Invalid spawn ID.');
	
	chat.all(client.name + ' updated the spawn position for spawn ID ' + spawnId + '.');
	spawn.setSpawnData(spawnId, client.player.position, client.player.heading);
};







spawn.getSpawnsPath = () =>
{
	return util.format(spawn.spawnsPath, spawn.gameFolderNames[server.game]);
};

spawn.getDataPath = () =>
{
	return util.format(spawn.dataPath, spawn.gameFolderNames[server.game]);
};

spawn.spawnPlayer = (client) =>
{
	var model = clientData.get(client, 'playerModel');
	var position = spawn.spawns.length == 0 ? spawn.getDefaultSpawnPosition() : spawn.spawns[util.randLen(spawn.spawns.length)].position;
	var heading = spawn.spawns.length == 0 ? spawn.getDefaultSpawnHeading() : spawn.spawns[util.randLen(spawn.spawns.length)].heading;
	spawnPlayer(client, position, heading, model);
	fadeCamera(client, true);
};

spawn.addSpawn = (position, heading) =>
{
	var spawnId = spawn.createSpawn(position, heading);
	xml.add(spawn.getSpawnsPath(), 'Spawn', {
		id:			spawnId,
		position:	util.posArray(position).join(','),
		heading: 	util.degrees(heading)
	});
	return spawnId;
};

spawn.removeSpawn = (spawnId) =>
{
	for(var i in spawn.spawns)
	{
		if(spawnId == spawn.spawns[i].id)
		{
			spawn.spawns.splice(i, 1);
			break;
		}
	}
	xml.remove(spawn.getSpawnsPath(), 'Spawn', 'id', spawnId);
};

spawn.setSpawnData = (spawnId, position, heading) =>
{
	var spawnData = spawn.getSpawn(spawnId);
	if(spawnData)
	{
		spawnData.position = position;
		spawnData.heading = heading;
	}
	xml.setAttr2(spawn.getSpawnsPath(), 'Spawn', {
		id:			spawnId
	}, {
		position:	util.posArray(position).join(','),
		rotation:	util.degrees(heading)
	});
};

spawn.createSpawn = (position, heading) =>
{
	var spawnId = spawn.getNextSpawnId();
	spawn.spawns.push({
		id:			spawnId,
		position:	position,
		heading:	heading
	});
	return spawnId;
};

spawn.getSpawn = (spawnId) =>
{
	for(var i in spawn.spawns)
	{
		if(spawnId == spawn.spawns[i].id)
		{
			return spawn.spawns[i];
		}
	}
	return null;
};

spawn.isSpawnId = (id) =>
{
	return spawn.getSpawn(id) != null;
};

spawn.getNextSpawnId = () =>
{
	var id = 0;
	while(spawn.isSpawnId(id))
		id++;
	return id;
};

spawn.getDefaultSpawnPosition = () =>
{
	switch(server.game)
	{
		case GAME_GTA_III:		return new Vec3(-24.618, -523.453, 19.37191);
		case GAME_GTA_VC:		return new Vec3(-247.6060333251953, -491.5196838378906, 11.201558113098145);
		case GAME_GTA_SA:		return new Vec3(-204.209, -356.726, 6.22967);
		case GAME_GTA_IV:		return new Vec3(0.0, 0.0, 30.0);
		default:				return new Vec3(0.0, 0.0, 0.0);
	}
};

spawn.getDefaultSpawnHeading = () => 0.0;

spawn.teleportClientToSpawn = (client, spawnId) =>
{
	if(!client.player)
		return;
	
	var spawnData = spawn.getSpawn(spawnId);
	if(!spawnData)
		return;
	
	var position = spawnData.position;
	var rotation = new Vec3(0.0, 0.0, spawnData.heading);
	util.callClientFunction(client, 'generic.setLocalPlayerPositionRotation', position, rotation);
};





(() =>
{
	xml.load(spawn.getSpawnsPath(), 'Spawn', (data) => spawn.createSpawn(util.vec3(data.position), util.radians(util.float(data.heading))));
	xml.save(spawn.getSpawnsPath(), 'Spawn', spawn.spawns, ['id', 'position', 'heading']);
	
	var root = util.loadXMLRoot(spawn.getDataPath());
	spawn.respawnDuration = parseInt(util.getXMLTag(root, 'Respawn').duration);
})();

