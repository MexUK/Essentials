global.generic = {};

generic.spawnArmour = null;
generic.spawnHealth = null;

generic.setLocalPlayerPositionRotation = function(position, heading)
{
	if(!localClient.player)
		return;
	
	if(localPlayer.vehicle)
	{
		localPlayer.vehicle.position = position;
		localPlayer.vehicle.heading = heading;
	}
	else
	{
		localPlayer.position = position;
		localPlayer.heading = heading;
	}
};

generic.setLocalPlayerInterior = function(interior)
{
	if(!localClient.player)
		return;
	
	localPlayer.interior = interior;
	gta.cameraInterior = interior;
};

generic.setLocalPlayerGravity = function(gravity)
{
	if(!localClient.player)
		return;
	
	gta.gravity = gravity;
};

generic.setLocalPlayerHealth = function(health)
{
	if(!localClient.player)
		return;
	
	localPlayer.health = health;
};

generic.setLocalPlayerArmour = function(armour)
{
	if(!localClient.player)
		return;
	
	localPlayer.armour = armour;
};

generic.setLocalPlayerbleeding = function(state)
{
	if(!localClient.player)
		return;
	
	localPlayer.bleeding = state;
};

// events
addEventHandler('onPedSpawn', (event,ped) =>
{
	ped.health = generic.spawnHealth;
	ped.armour = generic.spawnArmour;
});