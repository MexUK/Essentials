global.generic = {};

generic.spawnArmour = null;
generic.spawnHealth = null;

generic.setLocalPlayerPositionRotation = function(position, rotation)
{
	if(!localClient.player)
		return;
	
	if(localPlayer.vehicle)
	{
		localPlayer.vehicle.position = position;
		localPlayer.vehicle.setRotation(rotation);
	}
	else
	{
		localPlayer.position = position;
		localPlayer.heading = rotation.z;
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

generic.setLocalPlayerBleeding = function(state)
{
	if(!localClient.player)
		return;
	
	localPlayer.bleeding = state;
};

generic.setLocalPlayerProofs = function(proofs)
{
	if(!localClient.player)
		return;
	
	localPlayer.setProofs(...proofs);
};

// events
addEventHandler('onPedSpawn', (event,ped) =>
{
	ped.health = generic.spawnHealth;
	ped.armour = generic.spawnArmour;
});