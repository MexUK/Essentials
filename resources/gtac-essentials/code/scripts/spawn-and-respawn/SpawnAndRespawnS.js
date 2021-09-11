global.spawn = {};

(spawn.load = () =>
{
	var root = util.loadXMLRoot('data/scripts/spawn-and-respawn/SpawnAndRespawn.xml');
	
	spawn.spawns = util.getXMLArray(root, 'spawn', (pos) => new Vec3(parseFloat(pos.x), parseFloat(pos.y), parseFloat(pos.z)));
	spawn.respawnDuration = parseInt(util.getXMLTag(root, 'respawn').duration);
})();

// events
var cb1 = (e,c) => {
	if(generic.spawnHealth === undefined || generic.spawnArmour === undefined)
	{
		setTimeout(cb1, 250);
		return;
	}
	
	clientData.set(c, 'skin', 168);
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

// spawn player
spawn.spawnPlayer = function(c)
{
	var skin = clientData.get(c, 'skin');
	var pos = spawn.spawns[util.randLen(spawn.spawns.length)];
	spawnPlayer(c, pos, 0.0, skin);
	fadeCamera(c, true);
};

