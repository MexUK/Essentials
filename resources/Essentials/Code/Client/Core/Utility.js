global.util = {};

util.weaponNames = [
	'Unarmed',
	'Brass Knuckles',
	'Screw Driver',
	'Golf Club',
	'Night Stick',
	'Knife',
	'Baseball Bat',
	'Hammer',
	'Meat Cleaver',
	'Machete',
	'Katana',
	'Chainsaw',
	'Grenade',
	'Remote Detonation Grenades',
	'Tear Gas',
	'Molotov Cocktails',
	'Rocket',
	'Colt 45',
	'Python',
	'Chrome Shotgun',
	'Spaz Shotgun',
	'Stubby Shotgun',
	'Tec9',
	'Uzi',
	'Silenced Ingram',
	'Mp5',
	'M4',
	'Ruger',
	'Sniper Rifle',
	'Laser Sniper',
	'Rocket Launcher',
	'Flame Thrower',
	'M60',
	'Minigun'
];

// pixels
util.x = (ratio) =>
{
	return gta.width * ratio;
};

util.y = (ratio) =>
{
	return gta.height * ratio;
};

util.xy = (x, y) =>
{
	return new Vec2(gta.width * x, gta.height * y);
};

// angle
util.radians = function(deg)
{
	return deg * (Math.PI / 180.0);
};

util.degrees = function(rad)
{
	return rad * (180.0 / Math.PI);
};

util.constrainAngle = function(angle)
{
	angle = util.degrees(angle);
	angle = angle % 360.0;
	if(angle < 0.0)
		angle += 360.0;
	return util.radians(angle);
};

util.getAngleDiff = function(angle1, angle2)
{
	angle1 = util.degrees(util.constrainAngle(angle1));
	angle2 = util.degrees(util.constrainAngle(angle2));
	return util.radians(180.0 - Math.abs(Math.abs(angle1 - angle2) - 180.0));
};

util.getZDirection = function(vec)
{
	return Math.atan2(vec.y, vec.x);
};

// array
util.arrayToKeys = (array) =>
{
	let dictionary = {};
	array.map(v =>
	{
		dictionary[v] = true;
	});
	return dictionary;
};

util.arrayToKeysLower = (array) =>
{
	let dictionary = {};
	array.map(v =>
	{
		dictionary[v.toLowerCase()] = true;
	});
	return dictionary;
};

util.getArgsArray = function(argsObject, startIndex)
{
	if(!startIndex)
		startIndex = 0;
	var args = [];
	for(var i=startIndex; i<argsObject.length; i++)
	{
		args.push(argsObject[i]);
	}
	return args;
};

// client
util.findClient = function(text, defaultClient)
{
	text = text.trim();
	
	if(text.length == 0)
		return defaultClient;
	
	var clients = getClients();
	
	var textInt = parseInt(text, 10);
	
	if(!isNaN(textInt))
	{
		for(var clientId in clients)
		{
			if(textInt == clientId)
			{
				return clients[clientId];
			}
		}
	}
	
	var textLower = text.toLowerCase();
	
	for(var clientId in clients)
	{
		if(textLower == clients[clientId].name.toLowerCase())
		{
			return clients[clientId];
		}
	}
	
	for(var clientId in clients)
	{
		if(clients[clientId].name.toLowerCase().indexOf(textLower) != -1)
		{
			return clients[clientId];
		}
	}
	
	return null;
};

// physical
util.isMovingBackwards = function(physical)
{
	var zRot = physical.heading;
	var velZRot = util.getVelocityZAngle(physical.velocity);
	var zRotDiff = util.getAngleDiff(zRot, velZRot);
	
	/*
	console.log('zRot: '+util.degrees(zRot));
	console.log('velZRot: '+util.degrees(velZRot));
	console.log('zRotDiff: '+util.degrees(zRotDiff));
	*/
	
	return zRotDiff >= util.radians(135.0);
};

util.moveForward = function(physical, speed, maxSpeed)
{
	if(maxSpeed === null)
		maxSpeed = 1000.0;
	
	if(speed > 0.0 && physical.velocity.length >= maxSpeed)
		return;
	
	var incAngle = util.radians(90.0);
	var zAngle = physical.heading + util.radians(90.0);
	physical.velocity = physical.velocity.addSpherical(speed, incAngle, zAngle);
};

util.isAnyElementInFront = function(element1, radius)
{
	var hit = gta.processLineOfSight(
		element1.position,
		element1.position.addPolar(radius + 20.0, util.radians(90.0)),
		true,
		true,
		true,
		true,
		true,
		true,
		false,
		false
	);
	return hit === null;
};

util.raise = function(physical, speed)
{
	var incAngle = 0.0;
	var zAngle = 0.0;
	physical.velocity = physical.velocity.addSpherical(speed, incAngle, zAngle);
};

util.turnZ = function(physical, speed)
{
	physical.turnVelocity = new Vec3(0.0, 0.0, speed);
};

// math
util.getDistanceAboveGround = function(element)
{
	return element.position.z - gta.findGroundZCoordinate(new Vec2(element.position.x, element.position.y));
};

// network
util.callNetCallFunction = function(namespaceObject, argumentsObject)
{
	var clientFunctionName = argumentsObject[0];
	var args = util.getArgsArray(argumentsObject, 1);
	namespaceObject[clientFunctionName].apply(null, args);
};

// number
util.rand = function(min, max)
{
	return Math.random() * (max - min) + min;
};

// vehicle
util.getLocalVehicle = function()
{
	if(!localClient.player)
		return false;
	
	var v = localPlayer.vehicle;
	if(!v)
		return false;
	
	return v;
};

util.getNearestVehicle = function(sourcePosition)
{
	var vehicles = getVehicles();
	var closestVehicle = null;
	var closestDistance = 99999.9;
	for(var i in vehicles)
	{
		var distance = vehicles[i].position.distance(sourcePosition);
		if(distance < closestDistance)
		{
			closestVehicle = vehicles[i];
			closestDistance = distance;
		}
	}
	return closestVehicle;
};

// velocity
util.getVelocityZAngle = function(velocity)
{
	var speed = velocity.length;
	
	if(speed == 0.0)
	{
		return velocity.heading;
	}
	else
	{
		var frontAngleOffset = util.radians(-90.0);
		return util.constrainAngle(util.getZDirection(velocity) + frontAngleOffset);
	}
};

util.findWeaponModelId = function(weaponName)
{
	var weaponNameLower = weaponName.toLowerCase();
	
	for(var weaponId=0; weaponId<util.weaponNames.length; weaponId++)
	{
		if(util.weaponNames[weaponId].toLowerCase().indexOf(weaponNameLower) != -1)
		{
			return weaponId;
		}
	}
	
	return -1;
};

util.getGroundZ = function(x, y, entities)
{
	if(!entities)
		entities = [];

	var positions = [];
	for(var i=0,j=entities.length; i<j; i++)
	{
		positions[i] = entities[i].position;
		entities[i].position = new Vec3(3.0, 3.0, 2000.0);
	}
	
	/*
	var isSpawned = localClient.player != null;
	var localPlayerPosition;
	if(isSpawned)
	{
		localPlayerPosition = localPlayer.position;
		localClient.despawnPlayer();
	}
	*/
	
	var groundZ = gta.findGroundZCoordinate(new Vec2(x, y));
	
	/*
	if(isSpawned)
		spawnPlayer(localPlayerPosition);
	*/
	
	for(var i=0,j=entities.length; i<j; i++)
	{
		entities[i].position = positions[i];
	}
	
	return groundZ;
};

util.getObjectGroundPosition = function(object)
{
	/*
	var z = util.getGroundZ(object.position.x, object.position.y, [object, localPlayer]);
	var bbcenterz = object.boundingCentre.z;
	var bbzdiff = object.boundingMax.z - object.boundingMin.z;
	
	z += bbcenterz;
	z += bbzdiff / 2.0;
	
	return new Vec3(object.position.x, object.position.y, z);
	*/
	
	var z = util.getGroundZ(object.position.x, object.position.y, [object, localPlayer]);
	//console.log('ground z pos: '+z+', dis: '+object.distanceFromCentreOfMassToBaseOfModel+', bb min z: '+object.boundingMin.z+', bb max z: '+object.boundingMax.z+', bb center z: '+object.boundingCentre.z);
	
	//z -= (object.boundingMax.z - object.boundingMin.z) / 2.0;
	z -= object.boundingCentre.z;
	z += (object.boundingMax.z - object.boundingMin.z) / 2.0;
	//z -= object.distanceFromCentreOfMassToBaseOfModel;
	
	return new Vec3(object.position.x, object.position.y, z);
};

function translate(b, v) {
	///*
	var a = [
		b.m11, b.m12, b.m13, b.m14,
		b.m21, b.m22, b.m23, b.m24,
		b.m31, b.m32, b.m33, b.m34,
		b.m41, b.m42, b.m43, b.m44
	];
	//*/
	/*
	var a = [
		b.m11, b.m21, b.m31, b.m41,
		b.m12, b.m22, b.m32, b.m42,
		b.m13, b.m23, b.m33, b.m43,
		b.m14, b.m24, b.m34, b.m44
	];
	*/
	
	var out = [];
	var x = v.x,
		y = v.y,
		z = v.z;
	var a00, a01, a02, a03;
	var a10, a11, a12, a13;
	var a20, a21, a22, a23;

	if (a === out)
	{
	  out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	  out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	  out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	  out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	}
	else
	{
	  a00 = a[0];
	  a01 = a[1];
	  a02 = a[2];
	  a03 = a[3];
	  a10 = a[4];
	  a11 = a[5];
	  a12 = a[6];
	  a13 = a[7];
	  a20 = a[8];
	  a21 = a[9];
	  a22 = a[10];
	  a23 = a[11];
	  out[0] = a00;
	  out[1] = a01;
	  out[2] = a02;
	  out[3] = a03;
	  out[4] = a10;
	  out[5] = a11;
	  out[6] = a12;
	  out[7] = a13;
	  out[8] = a20;
	  out[9] = a21;
	  out[10] = a22;
	  out[11] = a23;
	  out[12] = a00 * x + a10 * y + a20 * z + a[12];
	  out[13] = a01 * x + a11 * y + a21 * z + a[13];
	  out[14] = a02 * x + a12 * y + a22 * z + a[14];
	  out[15] = a03 * x + a13 * y + a23 * z + a[15];
	}
	//return out;
	return new Vec3(out[12], out[13], out[14]);
}

util.getRotatedPoint = function(pos, rot, point)
{
	var matCuboidModel = new Matrix4x4;
	matCuboidModel.setIdentity();
	matCuboidModel.setRotate(rot);
	
	var point2 = translate(matCuboidModel, point);
	point2.x += pos.x;
	point2.y += pos.y;
	point2.z += pos.z;
	
	return point2;
};

util.getRotatedPoint2 = function(rot, point)
{
	var matCuboidModel = new Matrix4x4;
	matCuboidModel.setIdentity();
	matCuboidModel.setRotate(rot);
	
	return translate(matCuboidModel, point);
};

util.getBoxPointLines = function(pos, rot, min, max)
{
	var matCuboidModel = new Matrix4x4;
	matCuboidModel.setIdentity();
	matCuboidModel.setRotate(rot);
	
	var vecLeftEdgePointsAABB = [
		new Vec3(min.x, min.y, min.z),
		new Vec3(min.x, min.y, max.z),
		new Vec3(min.x, max.y, max.z),
		new Vec3(min.x, max.y, min.z)
	];
	
	var vecRightEdgePointsAABB = [
		new Vec3(max.x, max.y, max.z),
		new Vec3(max.x, max.y, min.z),
		new Vec3(max.x, min.y, min.z),
		new Vec3(max.x, min.y, max.z)
	];
	
	var vecSideLinePointsAABB = [
		vecLeftEdgePointsAABB[0],
		vecRightEdgePointsAABB[2],
		vecLeftEdgePointsAABB[1],
		vecRightEdgePointsAABB[3],
		vecLeftEdgePointsAABB[2],
		vecRightEdgePointsAABB[0],
		vecLeftEdgePointsAABB[3],
		vecRightEdgePointsAABB[1]
	];
	
	var vecLinePoints = [];
	var i2 = 0;
	for (var i = 0, j = vecLeftEdgePointsAABB.length; i < j; i++)
	{
		vecLinePoints[i2++] = translate(matCuboidModel, vecLeftEdgePointsAABB[i]);
		vecLinePoints[i2++] = translate(matCuboidModel, vecLeftEdgePointsAABB[(i == (j - 1)) ? 0 : (i + 1)]);
	}
	for (var i = 0, j = vecRightEdgePointsAABB.length; i < j; i++)
	{
		vecLinePoints[i2++] = translate(matCuboidModel, vecRightEdgePointsAABB[i]);
		vecLinePoints[i2++] = translate(matCuboidModel, vecRightEdgePointsAABB[(i == (j - 1)) ? 0 : (i + 1)]);
	}
	for (var i = 0, j = vecSideLinePointsAABB.length; i < j; i++)
	{
		vecLinePoints[i2++] = translate(matCuboidModel, vecSideLinePointsAABB[i]);
	}
	for (var i=0,j=vecLinePoints.length; i<j; i += 2)
	{
		vecLinePoints[i].x += pos.x;
		vecLinePoints[i].y += pos.y;
		vecLinePoints[i].z += pos.z;
		
		vecLinePoints[i+1].x += pos.x;
		vecLinePoints[i+1].y += pos.y;
		vecLinePoints[i+1].z += pos.z;
		
		//console.log(vecLinePoints[i].x+' '+vecLinePoints[i+1].x);
	}
	return vecLinePoints;
};

// network
addNetworkHandler('callClientFunction', (functionName, ...args) =>
{
	var func = util.getResolvedItem(functionName);
	if(func)
		func(...args);
});

addNetworkHandler('callClientMethod', (methodName, ...args) =>
{
	var func = util.getResolvedItem(methodName);
	if(func)
		func(...args);
});

addNetworkHandler('requestClientVariable', (variableName) =>
{
	var value = util.getResolvedItem(variableName);
	triggerNetworkEvent('requestClientVariable', value);
});

addNetworkHandler('requestClientProperty', (variableName) =>
{
	var value = util.getResolvedItem(variableName);
	triggerNetworkEvent('requestClientProperty', value);
});

addNetworkHandler('requestClientFunctionCall', (functionName, ...args) =>
{
	var func = util.getResolvedItem(functionName);
	if(func)
		triggerNetworkEvent('requestClientFunctionCall', func(...args));
});

addNetworkHandler('setClientVariable', (variableName, variableValue) =>
{
	var parts = variableName.split('.');
	var variableName2 = parts.pop();
	variableName = parts.join('.');
	
	var object = util.getResolvedItem(variableName);
	if(!object)
		return;
	
	object[variableName2] = variableValue;
});

addNetworkHandler('setClientProperty', (elementId, propertyName, propertyValue) =>
{
	var element = getElementFromId(elementId);
	if(!element)
		return;
	
	element[propertyName] = propertyValue;
});

util.getResolvedItem = (itemName) =>
{
	return util.getResolvedItemWithStart(itemName, global);
};

util.getResolvedItemWithStart = (itemName, start) =>
{
	var o = start;
	var parts = itemName.split('.');
	for(var i in parts)
		o = o[parts[i]];
	return o;
};

util.callServerFunction = (functionName, ...args) =>
{
	triggerNetworkEvent('callServerFunction', functionName, ...args);
};




util.getMinVec = function(a, b)
{
	if(b.x < a.x)
		a.x = b.x;
	if(b.y < a.y)
		a.y = b.y;
	if(b.z < a.z)
		a.z = b.z;
	return a;
};

util.getMaxVec = function(a, b)
{
	if(b.x > a.x)
		a.x = b.x;
	if(b.y > a.y)
		a.y = b.y;
	if(b.z > a.z)
		a.z = b.z;
	return a;
};

util.getColMinMax = function(object)
{
	var vertices = object.collisionVertices;
	var boxes = object.collisionBoxes;
	var spheres = object.collisionSpheres;
	var lines = object.collisionLines;
	
	if(vertices.length > 0 || boxes.length > 0 || spheres.length > 0 || lines.length > 0)
	{
		var min = new Vec3(99999,99999,99999);
		var max = new Vec3(-99999,-99999,-99999);
		
		if(vertices.length > 0)
		{
			for(var i=0,j=vertices.length; i<j; i++)
			{
				min = util.getMinVec(min, vertices[i]);
				max = util.getMaxVec(max, vertices[i]);
			}
		}
		
		if(boxes.length > 0)
		{
			for(var i=0,j=boxes.length; i<j; i += 2)
			{
				min = util.getMinVec(min, boxes[i]);
				max = util.getMaxVec(max, boxes[i + 1]);
			}
		}
		
		if(spheres.length > 0)
		{
			for(var i=0,j=spheres.length; i<j; i += 2)
			{
				min = util.getMinVec(min, spheres[i] - spheres[i + 1]);
				max = util.getMaxVec(max, spheres[i] + spheres[i + 1]);
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
		return [object.boundingMax, object.boundingMin];
	}
};

util.getColSize = function(object)
{
	var bbmm = util.getColMinMax(object);
	//var bbmm = util.getColMinMaxForObject(object);
	return new Vec3(bbmm[1].x - bbmm[0].x, bbmm[1].y - bbmm[0].y, bbmm[1].z - bbmm[0].z);
};

util.getColVerticesMinMax = function()
{
	var vertices = mapper.object.collisionVertices;
	
	if(vertices.length > 0)
	{
		var min = new Vec3(99999,99999,99999);
		var max = new Vec3(-99999,-99999,-99999);
		
		if(vertices.length > 0)
		{
			for(var i=0,j=vertices.length; i<j; i++)
			{
				min = util.getMinVec(min, vertices[i]);
				max = util.getMaxVec(max, vertices[i]);
			}
		}
		
		return [min, max];
	}
	else
	{
		return [mapper.object.boundingMax, mapper.object.boundingMin];
	}
};

util.drawBB = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var bbmm = util.getColMinMax(object);
	var lines = util.getBoxPointLines(object.position, object.getRotation(), bbmm[0], bbmm[1]);
	if(!lines || lines.length == 0)
		return;
	
	for(var i2=0, j2=lines.length; i2<j2; i2 += 2)
	{
		graphics.drawLine3D(lines[i2], lines[i2 + 1], colour, colour);
	}
};

util.drawBB2 = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var lines = util.getBoxPointLines(object.position, object.getRotation(), object.boundingMin, object.boundingMax);
	if(!lines || lines.length == 0)
		return;
	
	for(var i2=0, j2=lines.length; i2<j2; i2 += 2)
	{
		graphics.drawLine3D(lines[i2], lines[i2 + 1], colour, colour);
	}
};

util.drawColLines = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var points = object.collisionLines;
	if(!points || points.length == 0)
		return;
	
	for(var i=0, j=points.length; i<j; i += 2)
	{
		var p1 = points[i];
		var p2 = points[i + 1];
		
		p1 = util.getRotatedPoint(object.position, object.getRotation(), p1);
		p2 = util.getRotatedPoint(object.position, object.getRotation(), p2);
		
		graphics.drawLine3D(p1, p2, colour, colour);
	}
};

util.drawColBoxes = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var points = object.collisionBoxes;
	if(!points || points.length == 0)
		return;
	
	for(var i=0, j=points.length; i<j; i += 2)
	{
		var min = points[i];
		var max = points[i + 1];
		
		var lines = util.getBoxPointLines(object.position, object.getRotation(), min, max);
		
		for(var i2=0, j2=lines.length; i2<j2; i2 += 2)
		{
			graphics.drawLine3D(lines[i2], lines[i2 + 1], colour, colour);
		}
	}
};

util.drawColSpheres = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var points = object.collisionSpheres;
	if(!points || points.length == 0)
		return;
};

util.drawColTriangles = function(object, colour)
{
	if(!object.isType(ELEMENT_ENTITY))
		return;
	
	var points = object.collisionVertices;
	if(!points || points.length == 0)
		return;
	
	for(var i=0, j=points.length; i<j; i += 3)
	{
		for(var i2=0; i2<3; i2++)
		{
			var p1 = points[i + i2];
			var p2 = points[i2 == 2 ? i : (i + i2 + 1)];
			
			p1 = util.getRotatedPoint(object.position, object.getRotation(), p1);
			p2 = util.getRotatedPoint(object.position, object.getRotation(), p2);
			
			graphics.drawLine3D(p1, p2, colour, colour);
		}
	}
};

util.exportAll = () => {};

