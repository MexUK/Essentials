global.generic = {};
global.cmds = global.cmds || {};

generic.spawnHealth = null;
generic.spawnArmour = null;
generic.snowing = false;

// events
events.onPlayerJoined.push((event,client) =>
{
	util.setClientVariable(client, 'generic.spawnHealth', generic.spawnHealth);
	util.setClientVariable(client, 'generic.spawnArmour', generic.spawnArmour);
	util.callClientFunction(client, 'forceSnowing', generic.snowing);
	
	clientData.set(client, 'proofs', [false, false, false, false, false]);
});

// commands
cmds.commands = (client) =>
{
	var cmds2 = [];
	for(var cmd in cmds)
		cmds2.push(cmd);
	
	cmds2.sort();
	
	var cmdCount = cmds2.length;
	cmds2 = '/' + cmds2.join(' /');
	
	chat.all('Commands (' + cmdCount + '): ' + cmds2);
};

cmds.pos = (client, _target, _dp) =>
{
	var defaultDp = 5;
	var maxDp = 14;
	
	[_target, _dp] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxDp)
	],
	[
		client.name,
		defaultDp
	], _target, _dp);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var dp = util.int(_dp, defaultDp);
	if(dp < 0 || dp > maxDp)
		return chat.intBetween(client, 'Decimal Places', 0, maxDp, _dp);
	
	chat.all(target.name + "'s position" + (target.player.vehicle ? " (Ped)" : "") + ": " + util.pos(target).map(v => util.round(v, dp)).join(' '));
	if(target.player.vehicle)
		chat.all(target.name + "'s position (Vehicle): " + util.vehPos(target).map(v => util.round(v, dp)).join(' '));
};

cmds.rot = (client, _target, _dp, _deg) =>
{
	var options = [['deg'], ['rad']];
	var defaultDp = 5;
	var maxDp = 14;
	
	[_target, _dp, _deg] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxDp),
		(v) => util.isLeftText(v, options)
	],
	[
		client.name,
		defaultDp,
		'deg'
	], _target, _dp, _deg);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var dp = util.int(_dp, defaultDp);
	if(!util.between(dp, 0, maxDp))
		return chat.intBetween(client, 'Decimal Places', 0, maxDp, _dp);
	
	var deg = util.left(_deg, options, true);
	if(deg === undefined)
		return chat.invalidOption(client, options, _deg);
	
	chat.all(target.name + "'s rotation (" + (deg ? 'Degrees' : 'Radians') + ")" + (target.player.vehicle ? " (Ped)" : "") + ": " + util.rot(target,deg).map(v => util.round(v, dp)).join(' '));
	if(target.player.vehicle)
		chat.all(target.name + "'s rotation (" + (deg ? 'Degrees' : 'Radians') + ") (Vehicle): " + util.vehRot(target,deg).map(v => util.round(v, dp)).join(' '));
};

cmds.vehicleinfo = (client, _target) =>
{
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(target.player.vehicle)
		chat.all(target.name + "'s vehicle: " + target.player.vehicle.name + ' (Model ID ' + target.player.vehicle.modelIndex + ')');
	else
		chat.all(target.name + " isn't in a vehicle.");
};

cmds.playermodel = (client, _target, _newSkin) =>
{
	var defaultNewSkin = 168;
	var maxSkin = 250;
	
	[_target, _newSkin] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v)// && util.isSkin(util.int(v), 0, maxSkin)
	],
	[
		client.name,
		undefined
	], _target, _newSkin);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_newSkin === undefined)
		return chat.all(target.name + "'s player model ID: " + target.player.modelIndex);
	
	var newSkin = util.int(_newSkin, defaultNewSkin);
	if(newSkin < 0 || newSkin > maxSkin)
		return chat.intBetween(client, 'player Model ID', 0, maxSkin, _newSkin);
	
	chat.all(target.name + " changed "+util.their(client, target)+" player model ID to " + newSkin);
	target.player.modelIndex = newSkin;
};

cmds['goto'] = (client, _target, _radius) =>
{
	var defaultRadius = 2.5;
	var maxRadius = 100.0;
	
	[_target, _radius] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v) && util.between(util.float(v), 0.0, maxRadius)
	],
	[
		client.name,
		defaultRadius
	], _target, _radius);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var radius = util.float(_radius, defaultRadius);
	if(radius < 0.0 || radius > maxRadius)
		return chat.floatBetween(client, 'Radius', 0, maxRadius, _radius);
	
	if(radius == defaultRadius)
		chat.all(client.name + " teleported to player " + target.name);
	else
		chat.all(client.name + " teleported " + radius + " units away from player " + target.name);
	
	var targetPosition = target.player.vehicle ? target.player.vehicle.position : target.player.position;
	targetPosition = targetPosition.addPolar(radius, target.player.heading + Math.PI/2.0);
	var targetHeading = (target.player.vehicle ? target.player.vehicle.heading : target.player.heading) + Math.PI;
	
	util.callClientFunction(client, 'generic.setLocalPlayerPositionRotation', targetPosition, targetHeading);
	client.player.interior = target.player.interior;
};

cmds['get'] = (client, _target, _radius) =>
{
	var defaultRadius = 2.5;
	var maxRadius = 100.0;
	
	[_target, _radius] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v) && util.between(util.float(v), 0.0, maxRadius)
	],
	[
		client.name,
		defaultRadius
	], _target, _radius);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var radius = util.float(_radius, defaultRadius);
	if(radius < 0.0 || radius > maxRadius)
		return chat.floatBetween(client, 'Radius', 0, maxRadius, _radius);
	
	if(radius == defaultRadius)
		chat.all(client.name + " teleported player " + target.name + ' to them.');
	else
		chat.all(client.name + " teleported player " + target.name + " " + radius + " units away from them.");
	
	var clientPosition = client.player.vehicle ? client.player.vehicle.position : client.player.position;
	clientPosition = clientPosition.addPolar(radius, client.player.heading + Math.PI/2.0);
	var clientHeading = (client.player.vehicle ? client.player.vehicle.heading : client.player.heading) + Math.PI;
	
	util.callClientFunction(target, 'generic.setLocalPlayerPositionRotation', clientPosition, clientHeading);
	target.player.interior = client.player.interior;
};

cmds.interior = (client, _target, _interior) =>
{
	[_target, _interior] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v)
	],
	[
		client.name,
		undefined
	], _target, _interior);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_interior === undefined)
		return chat.all(target.name + "'s interior is " + target.player.interior + ".");
	
	var interior = util.int(_interior, null);
	if(interior === null)
		return chat.int(client, 'Interior', _interior);
	
	chat.all(client.name + " set " + target.name + "'s interior to " + interior + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerInterior', interior);
};

cmds.gravity = (client, _target, _gravity) =>
{
	[_target, _gravity] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _gravity);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_gravity === undefined)
		return util.requestClientVariable(target, 'gta.gravity', (gravity) => chat.all(target.name + "'s gravity is " + gravity + "."));
	
	var gravity = util.float(_gravity, null);
	if(gravity === null)
		return chat.float(client, 'Gravity', _gravity);
	
	chat.all(client.name + " set " + target.name + "'s gravity to " + gravity + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerGravity', gravity);
};

cmds.id = (client, _target, _id) =>
{
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v)
	],
	[
		client.name
	], _target);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	var parts = [];
		parts.push("Client ID: " + target.index + ".");
	if(target.player)
		parts.push("Player ID is " + target.player.id + ".");
	if(target.player.vehicle)
		parts.push("Vehicle ID is " + target.player.vehicle.id + ".");
	chat.all(target.name + "'s IDs. " + parts.join(' '));
};

cmds.health = (client, _target, _health) =>
{
	[_target, _health] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _health);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_health === undefined)
		return chat.all(target.name + "'s health is " + target.player.health + ".");
	
	var health = util.float(_health, null);
	if(health === null)
		return chat.float(client, 'Health', _health);
	
	chat.all(client.name + " set " + target.name + "'s health to " + health + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerHealth', health);
};

cmds.armour = (client, _target, _armour) =>
{
	[_target, _armour] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _armour);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_armour === undefined)
		return chat.all(target.name + "'s armour is " + target.player.armour + ".");
	
	var armour = util.float(_armour, null);
	if(armour === null)
		return chat.float(client, 'Armour', _armour);
	
	chat.all(client.name + " set " + target.name + "'s armour to " + armour + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerArmour', armour);
};

cmds.spawnhealth = (client, _health) =>
{
	[_health] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _health);
	
	if(_health === undefined)
		return chat.all("Spawn health is set to " + generic.getSpawnHealth() + ".");
	
	var health = util.float(_health, null);
	if(health === null)
		return chat.float(client, 'Spawn Health', _health);
	
	chat.all(client.name + " set spawn health to " + health + ".");
	generic.setSpawnHealth(health);
};

cmds.spawnarmour = (client, _armour) =>
{
	[_armour] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _armour);
	
	if(_armour === undefined)
		return chat.all("Spawn armour is set to " + generic.getSpawnArmour() + ".");
	
	var armour = util.float(_armour, null);
	if(armour === null)
		return chat.float(client, 'Spawn Armour', _armour);
	
	chat.all(client.name + " set spawn armour to " + armour + ".");
	generic.setSpawnArmour(armour);
};

cmds.bleeding = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_state === undefined)
		return util.requestClientProperty(target, 'localPlayer.bleeding', (state) => chat.all(target.name + " is " + (state ? "" : "not ") + "bleeding."));
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Bleeding', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "bleeding.");
	util.callClientFunction(target, 'generic.setLocalPlayerBleeding', state);
};

cmds.falloffbike = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_state === undefined)
		return util.requestClientProperty(target, 'localPlayer.canBeKnockedOffBike', (state) => chat.all(target.name + " " + (state ? "can" : "cannot") + " be knocked off a bike."));
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Fall Off Bike', _state);
	
	chat.all(client.name + " set " + target.name + "'s fall off bike status to " + (state ? "on" : "off ") + ".");
	util.setClientProperty(target, 'localPlayer.canBeKnockedOffBike', state);
};

cmds.crouch = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_state === undefined)
		return util.requestClientProperty(target, 'localPlayer.crouched', (state) => chat.all(target.name + "'s crouch status is " + (state ? "crouched" : "not crouched") + "."));
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Crouch Status', _state);
	
	chat.all(client.name + " set " + target.name + "'s crouch status to " + (state ? "crouched" : "not crouched") + ".");
	util.setClientProperty(target, 'localPlayer.crouching', state);
};

cmds.mass = (client, _target, _mass) =>
{
	[_target, _mass] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _mass);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_mass === undefined)
		return util.requestClientProperty(target, 'localPlayer.mass', (mass) => chat.all(target.name + "'s mass is " + mass + "."));
	
	var mass = util.float(_mass, null);
	if(mass === null)
		return chat.float(client, 'Mass', _mass);
	
	chat.all(client.name + " set " + target.name + "'s mass to " + mass + ".");
	util.setClientProperty(target, 'localPlayer.mass', mass);
};

cmds.vehiclehealth = (client, _target, _health) =>
{
	[_target, _health] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _health);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	if(_health === undefined)
		return util.requestClientProperty(target, 'localPlayer.vehicle.health', (health) => chat.all(target.name + "'s vehicle health is " + health + "."));
	
	var health = util.float(_health, null);
	if(health === null)
		return chat.float(client, 'Vehicle Health', _health);
	
	chat.all(client.name + " set " + target.name + "'s vehicle health to " + health + ".");
	util.setClientProperty(target, 'localPlayer.vehicle.health', health);
};

cmds.snow = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => util.isBool(v)
	],
	[
	], _state);
	
	if(_state === undefined)
		return chat.all('The weather is currently ' + (generic.snowing ? '' : 'not ') + 'snowing.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Snow', _state);
	
	chat.all(client.name + " set the snowing status to " + (state ? "on" : "off") + ".");
	generic.setSnowing(state);
};

cmds.speed = (client, _target, _speed) =>
{
	[_target, _speed] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _speed);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_speed === undefined)
		return util.requestClientProperty(target, target.player.vehicle ? 'localPlayer.vehicle.velocity.squaredLength' : 'localPlayer.velocity.squaredLength', (speed) => chat.all(target.name + "'s speed is " + speed + "."));
	
	var speed = util.float(_speed, null);
	if(speed === null)
		return chat.float(client, 'Speed', _speed);
	
	chat.all(client.name + " set " + target.name + "'s speed to " + speed + ".");
	var velocity = target.player.vehicle ? target.player.vehicle.velocity : target.player.velocity;
	var heading = target.player.vehicle ? target.player.vehicle.heading : target.player.heading;
	velocity = velocity.addPolar(speed, heading + (Math.PI / 2.0));
	if(target.player.vehicle)
		util.setClientProperty(target, 'localPlayer.vehicle.velocity', velocity);
	else
		util.setClientProperty(target, 'localPlayer.velocity', velocity);
};

cmds.whospawned = (client) =>
{
	var clients = getClients();
	var spawnedClients = [];
	for(var i in clients)
	{
		if(clients[i].player)
		{
			spawnedClients.push(clients[i]);
		}
	}
	if(spawnedClients.length == 0)
		chat.all('There are no spawned players.');
	else
		chat.all('Players spawned: ' + spawnedClients.map(v => v.name).join(', '));
};

cmds.whoinvehicle = (client) =>
{
	var clients = getClients();
	var occupantClients = [];
	for(var i in clients)
	{
		if(clients[i].player && clients[i].player.vehicle)
		{
			occupantClients.push(clients[i]);
		}
	}
	if(occupantClients.length == 0)
		chat.all('There are no players in a vehicle.');
	else
		chat.all('Players in a vehicle: ' + occupantClients.map(v => v.name).join(', '));
};

cmds.occupants = (client, _target) =>
{
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
	],
	[
		client.name
	], _target);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	var occupants = target.player.vehicle.getOccupants();
	occupants = occupants.map((v,i) => getClientFromPlayerElement(v).name + (i == 0 ? ' (Driver)' : ' (Passenger)'));
	chat.all(target.name + "'s vehicle occupants (" + occupants.length + " ped" + (occupants.length == 1 ? "" : "s") + "): " + occupants.join(', '));
};

var proofIDs =
{
	BULLET_PROOF:		0,
	FIRE_PROOF:			1,
	EXPLOSION_PROOF:	2,
	COLLISION_PROOF:	3,
	MELEE_PROOF:		4
};

cmds.bulletproof = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var proofs = clientData.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.BULLET_PROOF] ? '' : 'not ') + 'bullet proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Bullet Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "bullet proof.");
	proofs[proofIDs.BULLET_PROOF] = state;
	clientData.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};

cmds.fireproof = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var proofs = clientData.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.FIRE_PROOF] ? '' : 'not ') + 'fire proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Fire Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "fire proof.");
	proofs[proofIDs.FIRE_PROOF] = state;
	clientData.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};

cmds.explosionproof = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var proofs = clientData.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.EXPLOSION_PROOF] ? '' : 'not ') + 'explosion proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Explosion Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "explosion proof.");
	proofs[proofIDs.EXPLOSION_PROOF] = state;
	clientData.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};

cmds.collisionproof = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var proofs = clientData.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.COLLISION_PROOF] ? '' : 'not ') + 'collision proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Collision Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "collision proof.");
	proofs[proofIDs.COLLISION_PROOF] = state;
	clientData.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};

cmds.meleeproof = (client, _target, _state) =>
{
	[_target, _state] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isBool(v)
	],
	[
		client.name
	], _target, _state);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var proofs = clientData.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.MELEE_PROOF] ? '' : 'not ') + 'melee proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Melee Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "melee proof.");
	proofs[proofIDs.MELEE_PROOF] = state;
	clientData.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};














generic.getSpawnHealth = () =>
{
	return generic.spawnHealth;
};

generic.setSpawnHealth = (health) =>
{
	generic.spawnHealth = health;
	
	util.setClientsVariable('generic.spawnHealth', generic.spawnHealth);
	util.setClientsVariable('generic.spawnArmour', generic.spawnArmour);
	
	xml.set('data/scripts/generic/Generic.xml', 'SpawnHealth', health + "");
};

generic.loadSpawnHealth = () =>
{
	generic.spawnHealth = util.float(xml.get('data/scripts/generic/Generic.xml', 'SpawnHealth'), 100.0);
};





generic.getSpawnArmour = () =>
{
	return generic.spawnArmour;
};

generic.setSpawnArmour = (armour) =>
{
	generic.spawnArmour = armour;
	
	util.setClientsVariable('generic.spawnHealth', generic.spawnHealth);
	util.setClientsVariable('generic.spawnArmour', generic.spawnArmour);
	
	xml.set('data/scripts/generic/Generic.xml', 'SpawnArmour', armour + "");
};

generic.loadSpawnArmour = () =>
{
	generic.spawnArmour = util.float(xml.get('data/scripts/generic/Generic.xml', 'SpawnArmour'), 100.0);
};

generic.loadSpawnHealth();
generic.loadSpawnArmour();




generic.setSnowing = (state) =>
{
	generic.snowing = state;
	util.callClientsFunction('forceSnowing', state);
};




