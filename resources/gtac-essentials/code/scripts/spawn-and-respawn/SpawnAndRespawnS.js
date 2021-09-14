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
	
	clientData.set(c, 'skin', util.getRandomPedModel());
	spawn.spawnPlayer(c);
};
events.onPlayerJoined.push(cb1);

events.onPedWasted.push((e,p,a,w,pp) => {
	if(!p.isType(ELEMENT_PLAYER))
		return;
	
	var c = getClientFromPlayerElement(p);
	clientData.set(c, 'skin', p.modelIndex);
	
	util.clientTimer(c, function()
	{
		spawn.spawnPlayer(c);
	}, spawn.respawnDuration);
});






spawn.getPath = () =>
{
	return util.format(spawn.path, spawn.gameFolderNames[server.game]);
};

spawn.spawnPlayer = function(c)
{
	var skin = clientData.get(c, 'skin');
	var pos = spawn.spawns[util.randLen(spawn.spawns.length)];
	spawnPlayer(c, pos, 0.0, skin);
	fadeCamera(c, true);
};





(() =>
{
	var root = util.loadXMLRoot(spawn.getPath());
	
	spawn.spawns = util.getXMLArray(root, 'spawn', (pos) => new Vec3(parseFloat(pos.x), parseFloat(pos.y), parseFloat(pos.z)));
	spawn.respawnDuration = parseInt(util.getXMLTag(root, 'respawn').duration);
})();

