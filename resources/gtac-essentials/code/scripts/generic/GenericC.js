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
				generic.drawBB(elements[i][i2]);
			}
		}
	}
});









generic.getMinVec = function(a, b)
{
	if(b.x < a.x)
		a.x = b.x;
	if(b.y < a.y)
		a.y = b.y;
	if(b.z < a.z)
		a.z = b.z;
	return a;
};

generic.getMaxVec = function(a, b)
{
	if(b.x > a.x)
		a.x = b.x;
	if(b.y > a.y)
		a.y = b.y;
	if(b.z > a.z)
		a.z = b.z;
	return a;
};

generic.getColMinMax = (element) =>
{
	var vertices = element.collisionVertices;
	var boxes = element.collisionBoxes;
	var spheres = element.collisionSpheres;
	var lines = element.collisionLines;
	
	if(vertices.length > 0 || boxes.length > 0 || spheres.length > 0 || lines.length > 0)
	{
		var min = new Vec3(99999,99999,99999);
		var max = new Vec3(-99999,-99999,-99999);
		
		if(vertices.length > 0)
		{
			for(var i=0,j=vertices.length; i<j; i++)
			{
				min = generic.getMinVec(min, vertices[i]);
				max = generic.getMaxVec(max, vertices[i]);
			}
		}
		
		if(boxes.length > 0)
		{
			for(var i=0,j=boxes.length; i<j; i += 2)
			{
				min = generic.getMinVec(min, boxes[i]);
				max = generic.getMaxVec(max, boxes[i + 1]);
			}
		}
		
		if(spheres.length > 0)
		{
			for(var i=0,j=spheres.length; i<j; i += 2)
			{
				min = generic.getMinVec(min, spheres[i] - spheres[i + 1]);
				max = generic.getMaxVec(max, spheres[i] + spheres[i + 1]);
			}
		}
		
		if(lines.length > 0)
		{
			for(var i=0,j=lines.length; i<j; i += 2)
			{
				min = lines[i];
				max = lines[i + 1];
			}
		}
		return [min, max];
	}
	else
	{
		return [element.boundingMax, element.boundingMin];
	}
};

generic.drawBB = (element) =>
{
	var bbmm = generic.getColMinMax(element);
	var lines = util.getBoxPointLines(element.position, element.getRotation(), bbmm[0], bbmm[1]);
	if(!lines)
		return;
	
	for(var i2=0, j2=lines.length; i2<j2; i2 += 2)
	{
		graphics.drawLine3D(lines[i2], lines[i2 + 1], 0xff0000ff, 0xff0000ff);
	}
};



