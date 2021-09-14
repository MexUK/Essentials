global.spawn = {};

spawn.path = 'data/scripts/spawn-and-respawn/{0}/SpawnAndRespawn.xml';

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
cmds.addspawn = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	spawn.addSpawn(client.player.position);
	chat.all(client.name + ' added a spawn position.');
};

cmds.removespawn = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var positions = spawn.spawns.map((position,i) => [position, i, client.player.position.distance(position)]);
	
	if(positions.length == 0)
		return chat.pm(client, 'There are no spawn positions.');
	
	if(positions.length == 1)
		return chat.pm(client, 'There has to be at least 1 spawn position.');
	
	var maxDistanceAway = 5.0;
	positions.sort((a,b) => a[2] > b[2]);
	
	var position = positions[0][0];
	var distanceAway = positions[0][2];
	if(distanceAway > maxDistanceAway)
		return chat.pm(client, 'There are no spawn positions near you.');
	
	chat.all(client.name + ' removed a spawn position.');
	
	spawn.spawns.splice(positions[0][1], 1);
	xml.removeAttr2(spawn.getPath(), 'Spawn',
	{
		x: position.x,
		y: position.y,
		z: position.z,
	});
};

cmds.spawns = (client) =>
{
	if(spawn.spawns.length == 0)
		chat.all('There are no spawn positions.');
	else
		chat.all('There ' + util.isAre(spawn.spawns.length) + ' ' + spawn.spawns.length + ' spawn ' + util.plural('position', spawn.spawns.length) + '.');
};






spawn.getPath = () =>
{
	return util.format(spawn.path, spawn.gameFolderNames[server.game]);
};

spawn.spawnPlayer = function(c)
{
	var model = clientData.get(c, 'playerModel');
	var position = spawn.spawns[util.randLen(spawn.spawns.length)];
	spawnPlayer(c, position, 0.0, model);
	fadeCamera(c, true);
};

spawn.addSpawn = function(position)
{
	spawn.spawns.push(position);
	xml.add(spawn.getPath(), 'spawn', {
		x: position.x,
		y: position.y,
		z: position.z
	});
};





(() =>
{
	var root = util.loadXMLRoot(spawn.getPath());
	
	spawn.spawns = util.getXMLArray(root, 'spawn', (pos) => new Vec3(parseFloat(pos.x), parseFloat(pos.y), parseFloat(pos.z)));
	spawn.respawnDuration = parseInt(util.getXMLTag(root, 'respawn').duration);
})();

