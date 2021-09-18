global.generic = {};

generic.spawnArmour = null;
generic.spawnHealth = null;
generic.drawBounds = false;

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

generic.setLocalPlayerDrawBounds = function(enabled)
{
	generic.drawBounds = !generic.drawBounds;
};

generic.flipLocalPlayerVehicle = function()
{
	if(!localClient.player)
		return
	
	if(!localPlayer.vehicle)
		return;
	
	localPlayer.vehicle.turnVelocity = new Vec3(0.0, 0.0, 0.0);
	localPlayer.vehicle.setRotation(new Vec3(0.0, 0.0, localPlayer.vehicle.heading));
};

generic.getGroundZ = () =>
{
	if(!localClient.player)
		return;
	
	var ignore = [localPlayer];
	if(localPlayer.vehicle)
		ignore.push(localPlayer.vehicle);
	return util.getGroundZ(localPlayer.position.x, localPlayer.position.y, ignore);
};

// events
addEventHandler('onPedSpawn', (event,ped) =>
{
	ped.health = generic.spawnHealth;
	ped.armour = generic.spawnArmour;
});

addEventHandler('onBeforeDrawHUD', (event) =>
{
	if(generic.drawBounds)
	{
		var elements =
		[
			getObjects(),
			getVehicles(),
			getPeds()
		];
		for(var i in elements)
		{
			for(var i2 in elements[i])
			{
				util.drawBB(elements[i][i2], 0xFF223377);
			}
		}
	}
});









