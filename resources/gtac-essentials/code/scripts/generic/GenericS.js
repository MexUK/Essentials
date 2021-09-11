global.generic = {};
global.cmds = global.cmds || {};

generic.spawnHealth = null;
generic.spawnArmour = null;

// events
events.onPlayerJoined.push((event,client) =>
{
	util.setClientVariable(client, 'generic.spawnHealth', generic.spawnHealth);
	util.setClientVariable(client, 'generic.spawnArmour', generic.spawnArmour);
});

// commands
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

