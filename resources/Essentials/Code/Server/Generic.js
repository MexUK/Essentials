global.generic = {};
global.cmds = global.cmds || {};

generic.path = 'Data/Global/Generic.xml';
generic.spawnHealth = null;
generic.spawnArmour = null;
generic.snowing = false;

// events
events.bind('onPlayerJoined', (event, client) =>
{
	util.setClientVariable(client, 'generic.spawnHealth', generic.spawnHealth);
	util.setClientVariable(client, 'generic.spawnArmour', generic.spawnArmour);
	util.callClientFunction(client, 'forceSnowing', generic.snowing);
	
	cd.set(client, 'proofs', [false, false, false, false, false]);
});

// commands
cmds.commands = (client, searchOrIndex) =>
{
	var cmds2 = [];
	var aliasCmdCount = 0;
	for(var cmd in cmds)
	{
		if(commandAliases.isCommandAnAlias(cmd))
			aliasCmdCount++;
		cmds2.push(cmd);
	}
	
	cmds2.sort();
	
	if(searchOrIndex === undefined)
	{
		chat.all('There are '+cmds2.length+' commands. ('+aliasCmdCount+' alias'+(aliasCmdCount == 1 ? '' : 'es')+'). To search or split: /commands search or /commands number');
	}
	else if(util.isInt(searchOrIndex))
	{
		var index = util.int(searchOrIndex);
		
		cmds2 = generic.getCommandsArray(cmds2);
		
		if(index < 1 || index > cmds2.length)
			return chat.pm(client, 'Index must be between 1 and '+cmds2.length+'.');
		
		var chatLine = 'Commands ('+index+' of '+cmds2.length+'): /'+cmds2[index - 1].join(' /');
		chat.all(chatLine);
	}
	else
	{
		searchOrIndex = searchOrIndex.replace('/', '');
		
		cmds2 = cmds2.filter(cmd => cmd.toLowerCase().indexOf(searchOrIndex) != -1);
		if(cmds2.length == 0)
			return chat.pm(client, 'There were no commands found matching '+searchOrIndex+'.');
		
		var chatLine = 'Commands (matching '+searchOrIndex+'): /'+cmds2.join(' /');
		chat.all(chatLine);
	}
};

cmds.position = (client, _target, _dp) =>
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

cmds.rotation = (client, _target, _dp, _deg) =>
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
		chat.all(target.name + "'s vehicle: (ID " + target.player.vehicle.id + ") " + util.getVehicleModelName(target.player.vehicle.modelIndex) + ' (Model ID ' + target.player.vehicle.modelIndex + ')');
	else
		chat.all(target.name + " isn't in a vehicle.");
};

cmds.playermodel = (client, _target) =>
{
	var minModel = util.getMinPedModel();
	var maxModel = util.getMaxPedModel();
	var defaultNewModel = minModel;
	
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	chat.all(target.name + "'s player model ID: " + target.player.modelIndex);
};

cmds.setplayermodel = (client, _target, _newModel) =>
{
	var minModel = util.getMinPedModel();
	var maxModel = util.getMaxPedModel();
	var defaultNewModel = minModel;
	
	[_target, _newModel] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v) && util.between(util.int(v), minModel, maxModel)
	],
	[
		client.name,
		undefined
	], _target, _newModel);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_newModel === undefined)
		return chat.pm(client, 'Invalid player model.');
	
	var newModel = util.int(_newModel, defaultNewModel);
	if(newModel < 0 || newModel > maxModel)
		return chat.intBetween(client, 'player Model ID', 0, maxModel, _newModel);
	
	chat.all(target.name + " changed "+util.their(client, target)+" player model ID to " + newModel);
	target.player.modelIndex = newModel;
};

cmds.vehiclemodel = (client, _target) =>
{
	var minModel = util.getMinVehicleModel();
	var maxModel = util.getMaxVehicleModel();
	var defaultNewModel = minModel;
	
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	chat.all(target.name + "'s vehicle model: " + util.getVehicleModelName(target.player.vehicle.modelIndex) + ' (' + target.player.vehicle.modelIndex + ')');
};

cmds.setvehiclemodel = (client, _target, _newModel) =>
{
	var minModel = util.getMinVehicleModel();
	var maxModel = util.getMaxVehicleModel();
	var defaultNewModel = minModel;
	
	[_target, _newModel] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isVehicleModel(v)
	],
	[
		client.name,
		undefined
	], _target, _newModel);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	if(_newModel === undefined)
		return chat.pm(client, 'Invalid vehicle model.');
	
	var newModel = util.findVehicleModel(_newModel, defaultNewModel);
	if(newModel < minModel || newModel > maxModel)
		return chat.intBetween(client, 'Vehicle Model ID', minModel, maxModel, _newModel);
	
	chat.all(target.name + " changed "+util.their(client, target)+" vehicle model to " + util.getVehicleModelName(newModel) + ' (' + newModel + ')');
	target.player.vehicle.modelIndex = newModel;
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
	
	util.callClientFunction(client, 'generic.setLocalPlayerPositionRotation', targetPosition, new Vec3(0.0, 0.0, targetHeading));
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
	
	util.callClientFunction(target, 'generic.setLocalPlayerPositionRotation', clientPosition, new Vec3(0.0, 0.0, clientHeading));
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
		return chat.all(target.name + "'s interior is " + target.cameraInterior + ".");
	
	var interior = util.int(_interior, null);
	if(interior === null)
		return chat.int(client, 'Interior', _interior);
	
	chat.all(client.name + " set " + target.name + "'s interior to " + interior + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerInterior', interior);
};

cmds.interior2 = (client, ...args) =>
{
	let target = util.input.spawnedClient(args);
	let id = util.input.interior(args, true);

	if(!util.input.isValid())
		return;

	if(util.input.isFirstOptionalArgPresent())
	{
		chat.all(client.name + " set " + target.name + "'s camera interior to " + interior + ".");
		util.callClientFunction(target, 'generic.setLocalPlayerInterior', interior);
	}
	else
	{
		chat.all(target.name + "'s camera interior is " + target.cameraInterior + ".");
	}
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
	util.setClientVariable(target, 'localPlayer.canBeKnockedOffBike', state);
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
	util.setClientVariable(target, 'localPlayer.crouching', state);
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
	util.setClientVariable(target, 'localPlayer.mass', mass);
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
	util.setClientVariable(target, 'localPlayer.vehicle.health', health);
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
	
	let vehicle = target.player.vehicle;
	let inVehicle = vehicle != null;

	if(_speed === undefined)
		return util.requestClientProperty(target, inVehicle ? 'localPlayer.vehicle.velocity' : 'localPlayer.velocity', (velocity) => chat.all(target.name + "'s " + (target.player.vehicle ? "vehicle " : "") + "speed is " + (util.velocityToSpeed(velocity)) + "."));
	
	var speed = util.float(_speed, null);
	if(speed === null)
		return chat.float(client, 'Speed', _speed);
	
	chat.all(client.name + " set " + target.name + "'s " + (inVehicle ? "vehicle " : "") + "speed to " + speed + ".");
	
	var heading = inVehicle ? vehicle.heading : target.player.heading;
	var velocity = util.speedToVelocity(speed, heading + util.radians(90.0));
	
	if(inVehicle)
		util.setClientVariable(target, 'localPlayer.vehicle.velocity', velocity);
	else
		util.setClientVariable(target, 'localPlayer.velocity', velocity);
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
	
	var proofs = cd.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.BULLET_PROOF] ? '' : 'not ') + 'bullet proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Bullet Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "bullet proof.");
	proofs[proofIDs.BULLET_PROOF] = state;
	cd.set(client, 'proofs', proofs);
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
	
	var proofs = cd.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.FIRE_PROOF] ? '' : 'not ') + 'fire proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Fire Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "fire proof.");
	proofs[proofIDs.FIRE_PROOF] = state;
	cd.set(client, 'proofs', proofs);
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
	
	var proofs = cd.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.EXPLOSION_PROOF] ? '' : 'not ') + 'explosion proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Explosion Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "explosion proof.");
	proofs[proofIDs.EXPLOSION_PROOF] = state;
	cd.set(client, 'proofs', proofs);
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
	
	var proofs = cd.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.COLLISION_PROOF] ? '' : 'not ') + 'collision proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Collision Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "collision proof.");
	proofs[proofIDs.COLLISION_PROOF] = state;
	cd.set(client, 'proofs', proofs);
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
	
	var proofs = cd.get(client, 'proofs');
	if(_state === undefined)
		return chat.all(target.name + ' is ' + (proofs[proofIDs.MELEE_PROOF] ? '' : 'not ') + 'melee proof.');
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Melee Proof', _state);
	
	chat.all(client.name + " set " + target.name + " to be " + (state ? "" : "not ") + "melee proof.");
	proofs[proofIDs.MELEE_PROOF] = state;
	cd.set(client, 'proofs', proofs);
	util.callClientFunction(target, 'generic.setLocalPlayerProofs', proofs);
};

cmds.opengarage = (client, _garage) =>
{
	var maxGarage = 50;
	
	[_garage] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxGarage)
	],
	[
	], _garage);
	
	if(_garage === undefined)
		return chat.pm(client, "You didn't type a garage ID.");
	
	var garage = util.int(_garage, -1);
	if(garage < 0 || garage > maxGarage)
		return chat.pm(client, 'Invalid garage ID.');
	
	chat.all(client.name + ' opened garage ' + garage + '.');
	util.callClientFunctionForAll('openGarage', garage);
};

cmds.closegarage = (client, _garage) =>
{
	var maxGarage = 50;
	
	[_garage] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxGarage)
	],
	[
	], _garage);
	
	if(_garage === undefined)
		return chat.pm(client, "You didn't type a garage ID.");
	
	var garage = util.int(_garage, -1);
	if(garage < 0 || garage > maxGarage)
		return chat.pm(client, 'Invalid garage ID.');
	
	chat.all(client.name + ' closed garage ' + garage + '.');
	util.callClientFunctionForAll('closeGarage', garage);
};

cmds.isgarageclosed = (client, _garage) =>
{
	var maxGarage = 50;
	
	[_garage] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxGarage)
	],
	[
	], _garage);
	
	if(_garage === undefined)
		return chat.pm(client, "You didn't type a garage ID.");
	
	var garage = util.int(_garage, -1);
	if(garage < 0 || garage > maxGarage)
		return chat.pm(client, 'Invalid garage ID.');
	
	util.requestClientFunctionCall(client, 'isGarageClosed', (closed) => chat.all('Garage ' + garage + ' is ' + (closed ? 'closed' : 'open') + '.'), garage);
};

cmds.time = (client, _time) =>
{
	var minHour = 0;
	var maxHour = 23;
	var minMinute = 0;
	var maxMinute = 59;
	
	[_time] = util.grabArgs(client,
	[
		(v) => v && v.replace(' ', ':').split(':').length > 0
	],
	[
	], _time);
	
	if(_time === undefined)
		return chat.all("Game time: " + gta.time.hour + ":" + gta.time.minute + " (" + gta.time.second + " seconds)");
	
	var time = _time.replace(' ', ':').split(':');
	var hour = util.int(time[0], -1);
	var minute = util.int(time[1], -1);
	if(hour < minHour || hour > maxHour)
		return chat.pm(client, 'Invalid hour for game time.');
	if(minute < minMinute || minute > maxMinute)
		return chat.pm(client, 'Invalid minute for game time.');
	
	chat.all(client.name + " changed the game time to " + util.hour(hour) + ":" + util.minute(minute) + ".");
	gta.time.hour = hour;
	gta.time.minute = minute;
};

cmds.hour = (client, _hour) =>
{
	var minHour = 0;
	var maxHour = 23;
	
	[_hour] = util.grabArgs(client,
	[
		(v) => util.isInt(v)
	],
	[
	], _hour);
	
	if(_hour === undefined)
		return chat.all("Game hour: " + gta.time.hour);
	
	var hour = util.int(_hour, -1);
	if(hour < minHour || hour > maxHour)
		return chat.pm(client, 'Invalid hour for game time.');
	
	chat.all(client.name + " changed the game hour to " + util.hour(hour) + ".");
	gta.time.hour = hour;
};

cmds.minute = (client, _minute) =>
{
	var minMinute = 0;
	var maxMinute = 59;
	
	[_minute] = util.grabArgs(client,
	[
		(v) => util.isInt(v)
	],
	[
	], _minute);
	
	if(_minute === undefined)
		return chat.all("Game minute: " + gta.time.minute);
	
	var minute = util.int(_minute, -1);
	if(minute < minMinute || minute > maxMinute)
		return chat.pm(client, 'Invalid minute for game time.');
	
	chat.all(client.name + " changed the game minute to " + util.minute(minute) + ".");
	gta.time.minute = minute;
};

cmds.second = (client, _second) =>
{
	var minSecond = 0;
	var maxSecond = 59.99;
	
	[_second] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _second);
	
	if(_second === undefined)
		return chat.all("Game second: " + gta.time.second);
	
	var second = util.float(_second, -1);
	if(second < minSecond || second > maxSecond)
		return chat.pm(client, 'Invalid second for game time.');
	
	chat.all(client.name + " changed the game second to " + second + ".");
	gta.time.second = second;
};

cmds.kill = (client,) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	chat.all(client.name + " killed themself via command.");
	util.callClientFunction(client, 'generic.setLocalPlayerHealth', 0.0);
};

cmds.killplayer = (client, _target) =>
{
	if(_target === undefined)
		return chat.pm(client, "You didn't type a player name.");
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	chat.all(client.name + " killed " + target.name + " via command.");
	util.callClientFunction(target, 'generic.setLocalPlayerHealth', 0.0);
};

cmds.bounds = (client, _target, _state) =>
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
		return util.requestClientVariable(target, 'generic.drawBounds', (state) => chat.all(target.name + "'s collision boundaries are set to " + (state ? "" : "not ") + "render."));
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Bounds', _state);
	
	chat.all(client.name + " set collision boundaries to " + (state ? "" : "not ") + "render for " + target.name + ".");
	util.callClientFunction(target, 'generic.setLocalPlayerDrawBounds', state);
};

cmds.lights = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => v !== undefined && (util.isBool(v) || v.toLowerCase() == 'auto')
	],
	[
	], _state);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(!client.player.vehicle)
		return chat.notInVehicle(client, client);
	
	if(_state === undefined)
		return util.requestClientVariable(client, 'localPlayer.vehicle.lightStatus', (status) => chat.all(client.name + " has their vehicle lights set to " + (status == 0 ? 'automatic' : (status == 1 ? 'on' : 'off')) + '.'));
	
	var auto = _state.toLowerCase() == 'auto';
	var status = auto ? 0 : (util.bool(_state, null) === true ? 1 : (util.bool(_state, null) === false ? 2 : null));
	if(status === null)
		return chat.bool(client, 'Light Status (auto,bool)', _state);
	
	chat.all(client.name + " set their vehicle lights to " + (status == 0 ? 'automatic' : (status == 1 ? 'on' : 'off')) + '.');
	util.setClientVariable(client, 'localPlayer.vehicle.lightStatus', status);
};

cmds.pointgunat = (client, _target) =>
{
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v)
	],
	[
		client.name
	], _target);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	chat.all(client.name + " pointed a gun at " + target.name + ".");
	util.callClientFunction(target, 'localPlayer.pointGunAt', target.player);
};

cmds.ping = (client, _target) =>
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
	
	chat.all(target.name + " has ping " + target.ping + ".");
};

cmds.game = (client, _target) =>
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
	
	chat.all(target.name + " is playing game " + util.getGameName(server.game) + ".");
};

cmds.gameversion = (client, _target) =>
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
	
	chat.all(target.name + " is using game version index " + target.gameVersion + " for " + util.getGameName(server.game) + ".");
};

cmds.bigmessage = (client, _target, _int1, _int2, _text) =>
{
	[_target, _int1, _int2, _text] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v),
		(v) => util.isInt(v),
		(v) => v !== undefined
	],
	[
		client.name,
		0,
		0
	], _target, _int1, _int2, _text);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(_text === undefined)
		return chat.pm(client, "You didn't type any text.");
	
	var int1 = util.int(_int1);
	var int2 = util.int(_int2);
	var text = _text;
	
	chat.all(client.name + " drew a big message on " + target.name + "'s screen with text '" + text + "'.");
	util.callClientFunction(target, 'gta.bigMessage', text, int1, int2);
};

cmds.smallmessage = (client, _target, _int1, _int2, _text) =>
{
	[_target, _int1, _int2, _text] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v),
		(v) => util.isInt(v),
		(v) => v !== undefined
	],
	[
		client.name,
		0,
		0
	], _target, _int1, _int2, _text);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(_text === undefined)
		return chat.pm(client, "You didn't type any text.");
	
	var int1 = util.int(_int1);
	var int2 = util.int(_int2);
	var text = _text;
	
	chat.all(client.name + " drew a small message on " + target.name + "'s screen with text '" + text + "'.");
	util.callClientFunction(target, 'gta.smallMessage', text, int1, int2);
};

cmds.pagermessage = (client, _target, _int1, _int2, _int3, _text) =>
{
	[_target, _int1, _int2, _int3, _text] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v),
		(v) => util.isInt(v),
		(v) => util.isInt(v),
		(v) => v !== undefined
	],
	[
		client.name,
		0,
		0,
		0
	], _target, _int1, _int2, _int3, _text);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(_text === undefined)
		return chat.pm(client, "You didn't type any text.");
	
	var int1 = util.int(_int1);
	var int2 = util.int(_int2);
	var int3 = util.int(_int3);
	var text = _text;
	
	chat.all(client.name + " drew a pager message on " + target.name + "'s screen with text '" + text + "'.");
	util.callClientFunction(target, 'gta.pagerMessage', text, int1, int2, int3);
};

cmds.clearmessages = (client, _target) =>
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
	
	chat.all(client.name + " cleared all messages on " + target.name + "'s screen.");
	util.callClientFunction(target, 'gta.clearMessages');
};

cmds.weather = (client, _weather) =>
{
	[_weather] = util.grabArgs(client,
	[
		(v) => util.isInt(v)
	],
	[
	], _weather);
	
	if(_weather === undefined)
		return util.requestClientVariable(client, 'gta.currentWeather', (weather) => chat.all('Weather: ' + weather));
	
	var weather = util.int(_weather, -1);
	if(weather < 0 || weather > 20)
		return chat.pm(client, 'Invalid weather.');
	
	chat.all(client.name + " changed the weather to " + weather + ".");
	gta.forceWeather(weather);
};

cmds.flip = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(!client.player.vehicle)
		return chat.notInVehicle(client, client);
	
	chat.all(client.name + " flipped their vehicle.");
	util.callClientFunction(client, 'generic.flipLocalPlayerVehicle');
};

cmds.fix = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	chat.all(client.name + " fixed " + target.name + "'s vehicle.");
	target.player.vehicle.fix();
};

cmds.gotoposition = (client, _x, _y, _z) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_z === undefined)
		_z = client.player.position.z + '';
	
	var x = util.float(_x);
	var y = util.float(_y);
	var z = util.float(_z);
	
	if(_x === undefined)
		return chat.pm(client, "You didn't type an X coordinate.");
	
	if(!util.isFloat(_x))
		return chat.pm(client, "Invalid X coordinate.");
	
	if(_y === undefined)
		return chat.pm(client, "You didn't type a Y coordinate.");
	
	if(!util.isFloat(_y))
		return chat.pm(client, "Invalid Y coordinate.");
	
	if(!util.isFloat(_z))
		return chat.pm(client, "Invalid Z coordinate.");
	
	chat.all(client.name + " teleported to position "  + [x, y, z].join(', ') + '.');
	
	var position = new Vec3(x, y, z);
	var rotation = client.player.getRotation();
	//util.callClientFunction(client, 'generic.setLocalPlayerPositionRotation', position, rotation);
	client.player.position = position;
	client.player.setRotation(rotation);
};

cmds.heading = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	var heading = target.player.heading;
	chat.all(target.name + "'s heading is " + util.degrees(target.player.heading) + " degrees.");
	if(target.player.vehicle)
		chat.all(target.name + "'s vehicle heading is " + util.degrees(target.player.vehicle.heading) + " degrees.");
};

cmds.velocity = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientVariable(target, 'localPlayer.velocity', (velocity) =>
	{
		chat.all(target.name + "'s velocity is " + util.vec3ToArray(velocity).join(', ') + ".");
		if(target.player.vehicle)
		{
			util.requestClientVariable(target, 'localPlayer.vehicle.velocity', (velocity) => chat.all(target.name + "'s vehicle velocity is " + util.vec3ToArray(velocity).join(', ') + "."));
		}
	});
};

cmds.turnvelocity = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientVariable(target, 'localPlayer.turnVelocity', (velocity) =>
	{
		chat.all(target.name + "'s turn velocity is " + util.vec3ToArray(velocity).join(', ') + ".");
		if(target.player.vehicle)
		{
			util.requestClientVariable(target, 'localPlayer.vehicle.turnVelocity', (velocity) => chat.all(target.name + "'s vehicle turn velocity is " + util.vec3ToArray(velocity).join(', ') + "."));
		}
	});
};

cmds.ground = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientFunctionCall(target, 'generic.getGroundZ', (z) =>
	{
		chat.all(target.name + "'s ground Z coordinate is " + z + ".");
	});
};

cmds.damage = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => util.isBool(v)
	],
	[
	], _state);
	
	if(_state === undefined)
		return util.requestClientVariable(client, 'generic.damage', (state) => chat.all(client.name + "'s damage is " + (state ? 'enabled' : 'disabled') + "."));
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.pm(client, "You didn't specify a boolean option. e.g. 1 or 0");
	
	util.callClientFunction(client, 'generic.setLocalPlayerDamageStatus', state);
	chat.all(client.name + " " + (state ? 'enabled' : 'disabled') + " damage.");
};

cmds.eject = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(!target.player.vehicle)
		return chat.notInVehicle(client, target);
	
	chat.all(client.name + " ejected " + target.name + " from their vehicle.");
	util.callClientFunction(target, 'generic.removeLocalPlayerFromVehicle');
	
	if(global.tempPlayerVehicles && tempPlayerVehicles.hasVehicle(target))
		tempPlayerVehicles.removeVehicle(target);
};

cmds.pingabove = (client, _amount) =>
{
	[_amount] = util.grabArgs(client,
	[
		(v) => util.isInt(v)
	],
	[
	], _amount);
	
	if(_amount === undefined)
		return chat.pm(client, "You didn't type a ping amount.");
	
	var amount = util.int(_amount);
	if(amount < 0)
		return chat.pm(client, 'Invalid ping amount.');
	
	var players = [];
	getClients().forEach(client =>
	{
		if(client.ping > amount)
		{
			players.push(client.name + ' (' + client.ping + ')');
		}
	});
	
	if(players.length == 0)
		chat.all("There aren't any players with a ping above " + amount + ".");
	else
		chat.all("Players with ping above " + amount + ": " + players.join(', '));
};

cmds.announce = (client, ...args) =>
{
	if(args.length == 0 || args[0] === undefined)
		return chat.pm(client, "You didn't type any text to announce.");
	
	var text = args.join(' ');
	chat.all(text);
};

cmds.calltaxi = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(server.game != GAME_GTA_III && server.game != GAME_GTA_VC)
		return chat.pm(client, "This command only works on GTA III and GTA VC.");
	
	chat.all(client.name + " called for a taxi.");
	util.callClientFunction(client, 'generic.setLocalPlayerCallForTaxi');
};

cmds.centerofmass = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientVariable(target, 'localPlayer.centerOfMass', (centerOfMass) => chat.all(target.name + "'s player center of mass is " + util.vec3ToArray(centerOfMass).join(', ') + "."));
};

cmds.maxstamina = (client, _target, _stamina) =>
{
	[_target, _stamina] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isFloat(v)
	],
	[
		client.name
	], _target, _stamina);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_stamina === undefined)
		return util.requestClientVariable(target, 'localPlayer.maxStamina', (maxStamina) => chat.all(target.name + "'s max stamina is " + maxStamina + "."));
	
	var stamina = util.float(_stamina, null);
	if(stamina === null)
		return chat.pm(client, 'Invalid max stamina amount.');
	
	chat.all(client.name + " set " + target.name + "'s max stamina to " + stamina + ".");
	util.setClientVariable(target, 'localPlayer.maxStamina', stamina);
};

cmds.maxhealth = (client, _target, _health) =>
{
	[_target, _health] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v)
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
		return util.requestClientVariable(target, 'localPlayer.maxHealth', (maxHealth) => chat.all(target.name + "'s max health is " + maxHealth + "."));
	
	return chat.pm(client, 'The max health value cannot currently be set.');
};

cmds.entervehicle = (client, _vehicleId, _driver) =>
{
	[_vehicleId, _driver] = util.grabArgs(client,
	[
		(v) => elements.isVehicle(v),
		(v) => util.isBool(v)
	],
	[
	], _vehicleId, _driver);
	
	if(!client.player)
		return chat.pmNotSpawned(client, client);
	
	if(client.player.vehicle)
		return chat.pm(client, 'You are already in a vehicle.');
	
	if(_vehicleId === undefined)
		return chat.pm(client, "You didn't type a vehicle ID.");
	
	var vehicleId = util.int(_vehicleId);
	
	if(!elements.isVehicle(vehicleId))
		return chat.pm(client, 'Invalid vehicle ID.');
	
	var driver = util.bool(_driver, true);
	if(driver === null)
		return chat.pm(client, 'Invalid boolean option. e.g. 1 or 0.');
	
	chat.all(client.name + " started entering vehicle ID " + vehicleId + " as " + (driver ? "the driver" : "a passenger") + ".");
	util.callClientMethod(client, 'generic.makeLocalPlayerEnterVehicle', vehicleId, driver);
};

cmds.exitvehicle = (client) =>
{
	if(!client.player)
		return chat.pmNotSpawned(client, client);
	
	if(!client.player.vehicle)
		return chat.pm(client, 'You are not in a vehicle.');
	
	chat.all(client.name + " started exiting their vehicle.");
	util.callClientMethod(client, 'generic.makeLocalPlayerExitVehicle');
};

cmds.weaponstate = (client, _target) =>
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
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientProperty(target, 'localPlayer.weaponState', (weaponState) => chat.all(target.name + "'s weapon state is " + ['Ready', 'Firing', 'Reloading', 'Out of Ammunition', 'Melee made Contact'][weaponState] + "."));
};

cmds.warp = (client, _target, _vehicleId, _seat) =>
{
	[_target, _vehicleId, _seat] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => elements.isVehicle(v),
		(v) => util.isInt(v)
	],
	[
		client.name
	], _target, _vehicleId, _seat);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!client.player)
		return chat.pmNotSpawned(client, client);
	
	if(client.player.vehicle)
		return chat.pm(client, 'You are already in a vehicle.');
	
	if(_vehicleId === undefined)
		return chat.pm(client, "You didn't type a vehicle ID.");
	
	var vehicleId = util.int(_vehicleId);
	
	if(!elements.isVehicle(vehicleId))
		return chat.pm(client, 'Invalid vehicle ID.');
	
	var seat = util.int(_seat, 0);
	if(seat === null)
		return chat.pm(client, 'Invalid seat ID.');
	
	chat.all(client.name + " warped " + target.name + " into vehicle ID " + vehicleId + " as " + (seat == 0 ? "the driver" : "a passenger") + ".");
	util.callClientMethod(target, 'generic.warpLocalPlayerIntoVehicle', vehicleId, seat);
};

cmds.walkstyle = (client, _style) =>
{
	var maxStyle = 150;
	
	[_style] = util.grabArgs(client,
	[
		(v) => util.isInt(v)
	],
	[
	], _style);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_style === undefined)
		return util.requestClientVariable(client, 'localPlayer.walkStyle', (style) => chat.all(client.name + "'s walk style is " + style + "."));
	
	var style = util.int(_style);
	if(style < 0 || style > maxStyle)
		return chat.pm(client, 'Invalid walk style.');
	
	chat.all(client.name + " set their walk style to " + style + ".");
	util.setClientVariable(client, 'localPlayer.walkStyle', style);
};

cmds.xoffset = (client, _amount) =>
{
	[_amount] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _amount);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_amount === undefined)
		return chat.pm(client, "You didn't type an offset amount for the X coordinate.");
	
	var amount = util.float(_amount, null);
	if(amount === null)
		return chat.pm(client, 'Invalid offset amount for X coordinate.');
	
	chat.all(client.name + " changed their X coordinate by " + (amount < 0.0 ? amount : ('+' + amount)) + " units.");
	var position = client.player.position;
	position.x += amount;
	util.setClientVariable(client, 'localPlayer.position', position);
};

cmds.yoffset = (client, _amount) =>
{
	[_amount] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _amount);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_amount === undefined)
		return chat.pm(client, "You didn't type an offset amount for the Y coordinate.");
	
	var amount = util.float(_amount, null);
	if(amount === null)
		return chat.pm(client, 'Invalid offset amount for Y coordinate.');
	
	chat.all(client.name + " changed their Y coordinate by " + (amount < 0.0 ? amount : ('+' + amount)) + " units.");
	var position = client.player.position;
	position.y += amount;
	util.setClientVariable(client, 'localPlayer.position', position);
};

cmds.zoffset = (client, _amount) =>
{
	[_amount] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _amount);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_amount === undefined)
		return chat.pm(client, "You didn't type an offset amount for the Z coordinate.");
	
	var amount = util.float(_amount, null);
	if(amount === null)
		return chat.pm(client, 'Invalid offset amount for Z coordinate.');
	
	chat.all(client.name + " changed their Z coordinate by " + (amount < 0.0 ? amount : ('+' + amount)) + " units.");
	var position = client.player.position;
	position.z += amount;
	util.setClientVariable(client, 'localPlayer.position', position);
};

cmds.enterdriver = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	util.callClientFunction(client, 'generic.enterNearestVehicle', true);
};

cmds.enterpassenger = (client) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	util.callClientFunction(client, 'generic.enterNearestVehicle', false);
};

cmds.civilians = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => util.isBool(v)
	],
	[
	], _state);
	
	if(_state === undefined)
		return chat.pm(client, "Syntax for command is: /civilians [bool] - e.g. /civilians on");
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Civilians Enabled Status', _state);
	
	chat.all(client.name + " turned " + (state ? 'on' : 'off') + " civilians ai.");
	util.callClientFunctionForAll('gta.setCiviliansEnabled', state);
};

cmds.traffic = (client, _state) =>
{
	[_state] = util.grabArgs(client,
	[
		(v) => util.isBool(v)
	],
	[
	], _state);
	
	if(_state === undefined)
		return chat.pm(client, "Syntax for command is: /traffic [bool] - e.g. /traffic on");
	
	var state = util.bool(_state, null);
	if(state === null)
		return chat.bool(client, 'Traffic Enabled Status', _state);
	
	chat.all(client.name + " turned " + (state ? 'on' : 'off') + " traffic ai.");
	util.callClientFunctionForAll('gta.setTrafficEnabled', state);
};

cmds.trafficdensity = (client, _density) =>
{
	[_density] = util.grabArgs(client,
	[
		(v) => util.isFloat(v)
	],
	[
	], _density);
	
	if(_density === undefined)
		return util.requestClientProperty(client, 'gta.trafficDensity', (density) => chat.all("The traffic density is set to " + density + "."));
	
	var density = util.float(_density, null);
	if(density === null)
		return chat.pm(client, 'Invalid traffic density amount.');
	
	chat.all(client.name + " set the traffic density to " + density + ".");
	util.setClientVariableForAll('gta.trafficDensity', density);
};











generic.getSpawnHealth = () =>
{
	return generic.spawnHealth;
};

generic.setSpawnHealth = (health) =>
{
	generic.spawnHealth = health;
	
	util.setClientVariableForAll('generic.spawnHealth', generic.spawnHealth);
	util.setClientVariableForAll('generic.spawnArmour', generic.spawnArmour);
	
	xml.set(generic.path, 'SpawnHealth', health + "");
};

generic.loadSpawnHealth = () =>
{
	generic.spawnHealth = util.float(xml.get(generic.path, 'SpawnHealth'), 100.0);
};





generic.getSpawnArmour = () =>
{
	return generic.spawnArmour;
};

generic.setSpawnArmour = (armour) =>
{
	generic.spawnArmour = armour;
	
	util.setClientVariableForAll('generic.spawnHealth', generic.spawnHealth);
	util.setClientVariableForAll('generic.spawnArmour', generic.spawnArmour);
	
	xml.set(generic.path, 'SpawnArmour', armour + "");
};

generic.loadSpawnArmour = () =>
{
	generic.spawnArmour = util.float(xml.get(generic.path, 'SpawnArmour'), 100.0);
};

generic.loadSpawnHealth();
generic.loadSpawnArmour();




generic.setSnowing = (state) =>
{
	generic.snowing = state;
	util.callClientFunctionForAll('forceSnowing', state);
};




generic.getCommandsArray = (cmds) =>
{
	var every = 10;
	var cmds2 = [[]];
	var i2 = 0;
	for(var i=0,j=cmds.length; i<j; )
	{
		cmds2[i2].push(cmds[i]);
		
		if((++i % every) == 0)
		{
			cmds2[++i2] = [];
		}
	}
	if(cmds2[cmds2.length - 1].length == 0)
		cmds2.pop();
	return cmds2;
};