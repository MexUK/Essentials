global.elements = {};
global.cmds = global.cmds || {};

elements.MAX_OBJECTS	= 2048;
elements.MAX_VEHICLES	= 512;
elements.MAX_PICKUPS	= 330;
elements.MAX_SPHERES	= 127;
elements.MAX_BLIPS		= 127;
elements.MAX_PEDS		= 512 - server.maxClients;

elements.gameFolderNames =
[
	'unknown',
	'iii',
	'vc',
	'sa',
	'iv'
];

elements.paths = {};
elements.paths.objects = 'data/scripts/elements/{0}/Objects.xml';
elements.paths.vehicles = 'data/scripts/elements/{0}/Vehicles.xml';
elements.paths.pickups = 'data/scripts/elements/{0}/Pickups.xml';
elements.paths.spheres = 'data/scripts/elements/{0}/Spheres.xml';
elements.paths.peds = 'data/scripts/elements/{0}/Peds.xml';
elements.paths.blips = 'data/scripts/elements/{0}/Blips.xml';

elements.data = {};
elements.data.objects = [];
elements.data.vehicles = [];
elements.data.pickups = [];
elements.data.spheres = [];
elements.data.peds = [];
elements.data.blips = [];

elements.near = {};
elements.near.maxDistanceAway		= 1000000.0;
elements.near.defaultDistanceAway	= 20.0;

// api
elements.gamePath = (path) =>
{
	var folderName = elements.gameFolderNames[server.game];
	if(!folderName)
		folderName = 'UnknownGame';
	return util.format(path, folderName);
};

elements.nearElements = (client, elementName, distanceAway) =>
{
	var near = [];
	var clientPosition = client.player.vehicle ? client.player.vehicle.position : client.player.position;
	for(var i in elements.data[elementName])
	{
		var element = elements.data[elementName][i];
		var distance = clientPosition.distance(element.position);
		if(distance <= distanceAway)
		{
			near.push([element.id, distance]);
		}
	}
	near.sort((a,b) => a[1] > b[1]);
	near = near.map((v) => v[0]);
	return near;
};

elements.getElementDataById = (elementName, elementId) =>
{
	for(var i in elements.data[elementName])
	{
		if(elements.data[elementName][i].id == elementId)
		{
			return elements.data[elementName][i];
		}
	}
	return null;
};

elements.removeElement = (elementName, elementId) =>
{
	for(var i in elements.data[elementName])
	{
		if(elements.data[elementName][i].id == elementId)
		{
			elements.data[elementName].splice(i, 1);
			return;
		}
	}
};

// commands
cmds.object = (client, _model, _distanceAway) =>
{
	if(elements.data.objects.length > elements.MAX_OBJECTS)
		return chat.pm(client, 'Max amount of objects already reached! (' + elements.data.objects.length + '/' + elements.MAX_OBJECTS + ')');
	
	var minModel = util.getMinObjectModel();
	var maxModel = util.getMaxObjectModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 20.0;
	
	[_model, _distanceAway] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), minModel, maxModel),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway)
	],
	[
		undefined,
		defaultDistanceAway
	], _model, _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_model === undefined)
		return chat.pm(client, "You didn't type an object model.");
	
	var model = util.findObjectModel(_model);
	if(model < minModel || model > maxModel)
		return chat.intBetween(client, 'Object Model', minModel, maxModel, _model);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	if(distanceAway == defaultDistanceAway)
		chat.all(client.name + " added an object with model " + model + ".");
	else
		chat.all(client.name + " added an object " + distanceAway + " units away with model " + model + ".");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	var rotation = new Vec3(0.0, 0.0, client.player.heading);
	
	elements.addObject(model, position, rotation);
};

cmds.vehicle = (client, _model, _distanceAway) =>
{
	if(elements.data.vehicles.length > elements.MAX_VEHICLES)
		return chat.pm(client, 'Max amount of vehicles already reached! (' + elements.data.vehicles.length + '/' + elements.MAX_VEHICLES + ')');
	
	var minModel = util.getMinVehicleModel();
	var maxModel = util.getMaxVehicleModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 10.0;
	
	[_model, _distanceAway] = util.grabArgs(client,
	[
		(v) => util.isVehicleModel(v),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway)
	],
	[
		undefined,
		defaultDistanceAway
	], _model, _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_model === undefined)
		return chat.pm(client, "You didn't type a vehicle model.");
	
	var model = util.findVehicleModel(_model);
	if(model < minModel || model > maxModel)
		return chat.intBetween(client, 'Vehicle Model', minModel, maxModel, _model);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	if(distanceAway == defaultDistanceAway)
		chat.all(client.name + " added a vehicle with model " + util.getVehicleModelName(model) + " (" + model + ").");
	else
		chat.all(client.name + " added a vehicle " + distanceAway + " units away with model " + util.getVehicleModelName(model) + " (" + model + ").");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	var rotation = new Vec3(0.0, 0.0, client.player.heading);
	
	elements.addVehicle(model, position, rotation);
};

cmds.pickup = (client, _model, _distanceAway, _type) =>
{
	if(elements.data.pickups.length > elements.MAX_PICKUPS)
		return chat.pm(client, 'Max amount of pickups already reached! (' + elements.data.pickups.length + '/' + elements.MAX_PICKUPS + ')');
	
	var minModel = util.getMinObjectModel();
	var maxModel = util.getMaxObjectModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 10.0;
	var minType = 0;
	var maxType = 50;
	var defaultType = 1;
	
	[_model, _distanceAway, _type] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), minModel, maxModel),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway),
		(v) => util.isInt(v) && util.between(util.int(v), minType, maxType)
	],
	[
		undefined,
		defaultDistanceAway,
		defaultType
	], _model, _distanceAway, _type);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_model === undefined)
		return chat.pm(client, "You didn't type a pickup model.");
	
	var model = util.findObjectModel(_model);
	if(model < minModel || model > maxModel)
		return chat.intBetween(client, 'Pickup Model', minModel, maxModel, _model);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	var type = util.int(_type);
	if(type < minType || type > maxType)
		return chat.intBetween(client, 'Pickup Type', minType, maxType, _type);
	
	if(distanceAway == defaultDistanceAway)
		chat.all(client.name + " added a pickup with model " + model + ".");
	else
		chat.all(client.name + " added a pickup " + distanceAway + " units away with model " + model + ".");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	
	elements.addPickup(model, position);
};

cmds.sphere = (client, _radius, _distanceAway) =>
{
	if(elements.data.spheres.length > elements.MAX_SPHERES)
		return chat.pm(client, 'Max amount of spheres already reached! (' + elements.data.spheres.length + '/' + elements.MAX_SPHERES + ')');
	
	var minRadius = 0.0000001;
	var maxRadius = 10000.0;
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 0.0;
	
	[_radius, _distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), minRadius, maxRadius),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway)
	],
	[
		undefined,
		defaultDistanceAway
	], _radius, _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_radius === undefined)
		return chat.pm(client, "You didn't type a radius.");
	
	var radius = util.float(_radius);
	if(radius < minRadius || radius > maxRadius)
		return chat.intBetween(client, 'Sphere Radius', minRadius, maxRadius, _radius);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	if(distanceAway == defaultDistanceAway)
		chat.all(client.name + " added a sphere with radius " + radius + ".");
	else
		chat.all(client.name + " added a sphere " + distanceAway + " units away with radius " + radius + ".");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	
	elements.addSphere(position, radius);
};

cmds.ped = (client, _model, _distanceAway, _type) =>
{
	if(elements.data.peds.length > elements.MAX_PEDS)
		return chat.pm(client, 'Max amount of peds already reached! (' + elements.data.peds.length + '/' + elements.MAX_PEDS + ')');
	
	var minModel = util.getMinPedModel();
	var maxModel = util.getMaxPedModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 1.0;
	var minType = 0;
	var maxType = 50;
	var defaultType = 1;
	
	[_model, _distanceAway, _type] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), minModel, maxModel),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway),
		(v) => util.isInt(v) && util.between(util.int(v), minType, maxType)
	],
	[
		undefined,
		defaultDistanceAway,
		defaultType
	], _model, _distanceAway, _type);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_model === undefined)
		return chat.pm(client, "You didn't type a ped model.");
	
	var model = util.findPedModel(_model);
	if(model < minModel || model > maxModel)
		return chat.intBetween(client, 'Ped Model', minModel, maxModel, _model);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	var type = util.int(_type);
	if(type < minType || type > maxType)
		return chat.intBetween(client, 'Ped Type', minType, maxType, _type);
	
	if(distanceAway == defaultDistanceAway && type == defaultType)
		chat.all(client.name + " added a ped with model " + model + ".");
	else if(distanceAway != defaultDistanceAway && type != defaultType)
		chat.all(client.name + " added a ped " + distanceAway + " units away with model " + model + " and ped type " + type + ".");
	else if(distanceAway != defaultDistanceAway)
		chat.all(client.name + " added a ped " + distanceAway + " units away with model " + model + ".");
	else if(type != defaultType)
		chat.all(client.name + " added a ped with model " + model + " and ped type " + type + ".");
	else
		chat.all(client.name + " added a ped with model " + model + ".");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	var heading = client.player.heading;
	
	elements.addPed(model, position, heading, type);
};

cmds.blip = (client, _icon, _distanceAway, _size) =>
{
	if(elements.data.blips.length > elements.MAX_BLIPS)
		return chat.pm(client, 'Max amount of blips already reached! (' + elements.data.blips.length + '/' + elements.MAX_BLIPS + ')');
	
	var minIcon = util.getMinBlipModel();
	var maxIcon = util.getMaxBlipModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 0.0;
	var minSize = 0;
	var maxSize = 50;
	var defaultSize = 2;
	
	[_icon, _distanceAway, _size] = util.grabArgs(client,
	[
		(v) => util.isInt(v) && util.between(util.int(v), minIcon, maxIcon),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxDistanceAway, maxDistanceAway),
		(v) => util.isInt(v) && util.between(util.int(v), minSize, maxSize)
	],
	[
		undefined,
		defaultDistanceAway,
		defaultSize
	], _icon, _distanceAway, _size);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_icon === undefined)
		return chat.pm(client, "You didn't type a blip icon.");
	
	var icon = util.findBlipIcon(_icon);
	if(icon < minIcon || icon > maxIcon)
		return chat.intBetween(client, 'Blip Icon', minIcon, maxIcon, _icon);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -maxDistanceAway || distanceAway > maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -maxDistanceAway, maxDistanceAway, _distanceAway);
	
	var size = util.int(_size);
	if(size < minSize || size > maxSize)
		return chat.intBetween(client, 'Blip Size', minSize, maxSize, _size);
	
	if(distanceAway == defaultDistanceAway)
		chat.all(client.name + " added a blip with icon " + icon + ".");
	else
		chat.all(client.name + " added a blip " + distanceAway + " units away with icon " + icon + ".");
	
	var position = client.player.position.addPolar(distanceAway, client.player.heading + (Math.PI / 2.0));
	var colour = util.getRandomRGB();
	
	elements.addBlip(icon, position, size, colour);
};

cmds.maxplayers = (client) => chat.all('Max players: ' + server.maxClients);
cmds.maxobjects = (client) => chat.all('Max objects: ' + elements.MAX_OBJECTS);
cmds.maxvehicles = (client) => chat.all('Max vehicles: ' + elements.MAX_VEHICLES);
cmds.maxpickups = (client) => chat.all('Max pickups: ' + elements.MAX_PICKUPS);
cmds.maxspheres = (client) => chat.all('Max spheres: ' + elements.MAX_SPHERES);
cmds.maxpeds = (client) => chat.all('Max peds: ' + elements.MAX_PEDS + ' (excluding ' + server.maxClients + ' player peds)');
cmds.maxblips = (client) => chat.all('Max blips: ' + elements.MAX_BLIPS);

cmds.players = (client) => chat.all('Players: ' + getClients().length + '/' + server.maxClients);
cmds.objects = (client) => chat.all('Objects: ' + elements.data.objects.length + '/' + elements.MAX_OBJECTS);
cmds.vehicles = (client) => chat.all('Vehicles: ' + elements.data.vehicles.length + '/' + elements.MAX_VEHICLES);
cmds.pickups = (client) => chat.all('Pickups: ' + elements.data.pickups.length + '/' + elements.MAX_PICKUPS);
cmds.spheres = (client) => chat.all('Spheres: ' + elements.data.spheres.length + '/' + elements.MAX_SPHERES);
cmds.peds = (client) => chat.all('Peds: ' + elements.data.peds.length + '/' + elements.MAX_PEDS + ' (excluding ' + getClients().length + '/' + server.maxClients + ' player peds)');
cmds.blips = (client) => chat.all('Blips: ' + elements.data.blips.length + '/' + elements.MAX_BLIPS);











cmds.nearplayers = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = [];
	var clientPosition = client.player.position;
	getClients().map(v =>
	{
		if(v != client && v.player && v.player.position.distance(clientPosition) <= distanceAway)
		{
			near.push(client);
		}
	});
	near = near.map(v => v.name);
	
	if(near.length == 0)
		chat.all(client.name + " is not near any players. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('player', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearobjects = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'objects', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any objects. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('object', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearvehicles = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'vehicles', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any vehicles. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('vehicle', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearpickups = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'pickups', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any pickups. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('pickup', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearspheres = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'spheres', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any spheres. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('sphere', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearpeds = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'peds', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any peds. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('ped', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};

cmds.nearblips = (client, _distanceAway) =>
{
	[_distanceAway] = util.grabArgs(client,
	[
		(v) => util.isFloat(v) && util.between(util.float(v), -elements.near.maxDistanceAway, elements.near.maxDistanceAway),
	],
	[
		elements.near.defaultDistanceAway
	], _distanceAway);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	var distanceAway = util.float(_distanceAway);
	if(distanceAway < -elements.near.maxDistanceAway || distanceAway > elements.near.maxDistanceAway)
		return chat.intBetween(client, 'Distance Away', -elements.near.maxDistanceAway, elements.near.maxDistanceAway, _distanceAway);
	
	var near = elements.nearElements(client, 'blips', distanceAway);
	if(near.length == 0)
		chat.all(client.name + " is not near any blips. (" + distanceAway + " units)");
	else
		chat.all(client.name + " is near " + util.plural('blip', near.length) + " (" + distanceAway + " units): " + near.join(' '));
};



cmds.removeobject = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove object mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'objects');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_OBJECTS)
		return chat.intBetween(client, 'Object ID', 0, elements.MAX_OBJECTS, _elementId);
	
	if(!elements.isObject(elementId))
		return chat.pm(client, 'Object ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed object ID " + elementId + ". (Model " + getElementFromId(elementId).modelIndex + ")");
	elements.removeObject(elementId);
};

cmds.removevehicle = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove vehicle mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'vehicles');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_VEHICLES)
		return chat.intBetween(client, 'Vehicle ID', 0, elements.MAX_VEHICLES, _elementId);
	
	if(!elements.isVehicle(elementId))
		return chat.pm(client, 'Vehicle ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed vehicle ID " + elementId + ". (Model " + util.getVehicleModelName(getElementFromId(elementId).modelIndex) + " ID " + getElementFromId(elementId).modelIndex + ")");
	elements.removeVehicle(elementId);
};

cmds.removepickup = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove pickup mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'pickups');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_PICKUPS)
		return chat.intBetween(client, 'Pickup ID', 0, elements.MAX_PICKUPS, _elementId);
	
	if(!elements.isPickup(elementId))
		return chat.pm(client, 'Pickup ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed pickup ID " + elementId + ". (Model " + elements.getElementDataById('pickups', elementId).model + ")");
	elements.removePickup(elementId);
};

cmds.removesphere = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove sphere mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'spheres');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_SPHERES)
		return chat.intBetween(client, 'Sphere ID', 0, elements.MAX_SPHERES, _elementId);
	
	if(!elements.isSphere(elementId))
		return chat.pm(client, 'Sphere ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed sphere ID " + elementId + ". (Radius " + elements.getElementDataById('spheres', elementId).radius + ")");
	elements.removeSphere(elementId);
};

cmds.removeblip = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove blip mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'blips');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_BLIPS)
		return chat.intBetween(client, 'Blip ID', 0, elements.MAX_BLIPS, _elementId);
	
	if(!elements.isBlip(elementId))
		return chat.pm(client, 'Blip ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed blip ID " + elementId + ". (Icon " + elements.getElementDataById('blips', elementId).icon + ")");
	elements.removeBlip(elementId);
};

cmds.removeped = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
	{
		var newEnabledState = !removeMode.isRemoveModeEnabled(client);
		chat.all(client.name + " " + (newEnabledState ? "enabled" : "disabled") + " remove ped mode.");
		if(newEnabledState)
			removeMode.enableRemoveMode(client, 'peds');
		else
			removeMode.disableRemoveMode(client);
		return;
	}
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_PEDS)
		return chat.intBetween(client, 'Ped ID', 0, elements.MAX_PEDS, _elementId);
	
	if(!elements.isPed(elementId))
		return chat.pm(client, 'Ped ID ' + elementId + ' does not exist.');
	
	chat.all(client.name + " removed ped ID " + elementId + ". (Model " + getElementFromId(elementId).modelIndex + ")");
	elements.removePed(elementId);
};







elements.getElementTypeName = (elementId) =>
{
	switch(getElementFromId(elementId).type)
	{
		case ELEMENT_OBJECT:	return 'Object';
		case ELEMENT_VEHICLE:	return 'Vehicle';
		case ELEMENT_PICKUP:	return 'Pickup';
		case ELEMENT_MARKER:	return 'Sphere';
		case ELEMENT_PED:		return 'Peds';
		case ELEMENT_BLIP:		return 'Blips';
	}
	return 'Unknown';
};

elements.isElementOnScreen = (client, elementId, onScreen) =>
{
	chat.all(elements.getElementTypeName(elementId) + " ID " + elementId + " is " + (onScreen ? '' : 'not ') + 'on ' + client.name + "'s screen.");
};

cmds.isobjectonscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type an object ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_OBJECTS)
		return chat.intBetween(client, 'Object ID', 0, elements.MAX_OBJECTS, _elementId);
	
	if(!elements.isObject(elementId))
		return chat.pm(client, 'Object ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};

cmds.isvehicleonscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type a vehicle ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_VEHICLES)
		return chat.intBetween(client, 'Vehicle ID', 0, elements.MAX_VEHICLES, _elementId);
	
	if(!elements.isVehicle(elementId))
		return chat.pm(client, 'Vehicle ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};

cmds.ispickuponscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type an pickup ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_PICKUPS)
		return chat.intBetween(client, 'Pickup ID', 0, elements.MAX_PICKUPS, _elementId);
	
	if(!elements.isPickup(elementId))
		return chat.pm(client, 'Pickup ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};

cmds.issphereonscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type an sphere ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_SPHERES)
		return chat.intBetween(client, 'Sphere ID', 0, elements.MAX_SPHERES, _elementId);
	
	if(!elements.isSphere(elementId))
		return chat.pm(client, 'Sphere ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};

cmds.ispedonscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type an ped ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_PEDS)
		return chat.intBetween(client, 'Ped ID', 0, elements.MAX_PEDS, _elementId);
	
	if(!elements.isPed(elementId))
		return chat.pm(client, 'Ped ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};

cmds.isbliponscreen = (client, _elementId) =>
{
	[_elementId] = util.grabArgs(client,
	[
		(v) => util.isInt(v),
	],
	[
	], _elementId);
	
	if(_elementId === undefined)
		return chat.pm(client, "You didn't type an blip ID.");
	
	var elementId = util.int(_elementId);
	if(elementId < 0 || elementId > elements.MAX_BLIPS)
		return chat.intBetween(client, 'Blip ID', 0, elements.MAX_BLIPS, _elementId);
	
	if(!elements.isBlip(elementId))
		return chat.pm(client, 'Blip ID ' + elementId + ' does not exist.');
	
	util.callClientMethod(client, 'elements.isElementOnScreen', elementId);
};







// objects
elements.addObject = (model, position, rotation) =>
{
	var element = elements.createObject(model, position, rotation);
	xml.add(elements.gamePath(elements.paths.objects), 'Object',
	{
		id:			element.id,
		model:		model,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
	return element;
};
elements.removeObject = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('objects', elementId);
	xml.remove(elements.gamePath(elements.paths.objects), 'Object', 'id', elementId);
};
elements.createObject = (model, position, rotation) =>
{
	var element = gta.createObject(model, position);
	element.setRotation(rotation);
	elements.data.objects.push({
		id:			element.id,
		model:		model,
		position:	position,
		rotation:	rotation
	});
	return element;
};

elements.setObjectData = (elementId, model, position, rotation) =>
{
	elements.data.forEach(v =>
	{
		if(v.id == elementId)
		{
			v.position = position;
			v.rotation = rotation;
			v.model = model;
		}
	});
	xml.setAttr2(elements.gamePath(elements.paths.objects), 'Object', {
		id:			elementId
	}, {
		model:		model,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
};

// vehicles
elements.addVehicle = (model, position, rotation) =>
{
	var element = elements.createVehicle(model, position, rotation);
	xml.add(elements.gamePath(elements.paths.vehicles), 'Vehicle',
	{
		id:			element.id,
		model:		model,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
	return element;
};
elements.removeVehicle = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('vehicles', elementId);
	xml.remove(elements.gamePath(elements.paths.vehicles), 'Vehicle', 'id', elementId);
};
elements.createVehicle = (model, position, rotation) =>
{
	var element = gta.createVehicle(model, position);
	element.setRotation(rotation);
	elements.data.vehicles.push({
		id:			element.id,
		model:		model,
		position:	position,
		rotation:	rotation
	});
	return element;
};

// pickups
elements.addPickup = (model, position) =>
{
	var element = elements.createPickup(model, position);
	xml.add(elements.gamePath(elements.paths.pickups), 'Pickup',
	{
		id:			element.id,
		model:		model,
		position:	util.posArray(position).join(',')
	});
	return element;
};
elements.removePickup = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('pickups', elementId);
	xml.remove(elements.gamePath(elements.paths.pickups), 'Pickup', 'id', elementId);
};
elements.createPickup = (model, position) =>
{
	var element = gta.createPickup(model, position);
	elements.data.pickups.push({
		id:			element.id,
		model:		model,
		position:	position
	});
	return element;
};

// spheres
elements.addSphere = (position, radius) =>
{
	var element = elements.createSphere(position, radius);
	xml.add(elements.gamePath(elements.paths.spheres), 'Sphere',
	{
		id:			element.id,
		position:	util.posArray(position).join(','),
		radius:		radius
	});
	return element;
};
elements.removeSphere = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('spheres', elementId);
	xml.remove(elements.gamePath(elements.paths.spheres), 'Sphere', 'id', elementId);
};
elements.createSphere = (position, radius) =>
{
	var element = gta.createSphere(position, radius);
	elements.data.spheres.push({
		id:			element.id,
		position:	position,
		radius:		radius
	});
	return element;
};

// blips
elements.addBlip = (icon, position, size, colour) =>
{
	var element = elements.createBlip(icon, position, size, 0xFF0025FF);
	xml.add(elements.gamePath(elements.paths.blips), 'Blip',
	{
		id:			element.id,
		icon:		icon,
		position:	util.posArray(position).join(','),
		size:		size,
		colour:		colour
	});
	return element;
};
elements.removeBlip = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('blips', elementId);
	xml.remove(elements.gamePath(elements.paths.blips), 'Blip', 'id', elementId);
};
elements.createBlip = (icon, position, size, colour) =>
{
	var element = gta.createBlip(icon, position, size, colour);
	element.position = position;
	elements.data.blips.push({
		id:			element.id,
		icon:		icon,
		position:	position,
		size:		size,
		colour:		colour
	});
	return element;
};

// peds
elements.addPed = (model, position, heading, pedType) =>
{
	var element = elements.createPed(model, position, heading, pedType);
	xml.add(elements.gamePath(elements.paths.peds), 'Ped',
	{
		id:			element.id,
		model:		model,
		position:	util.posArray(position).join(','),
		heading:	heading,
		pedType:	pedType
	});
	return element;
};
elements.removePed = (elementId) =>
{
	destroyElement(getElementFromId(elementId));
	elements.removeElement('peds', elementId);
	xml.remove(elements.gamePath(elements.paths.peds), 'Ped', 'id', elementId);
};
elements.createPed = (model, position, heading, pedType) =>
{
	var element = gta.createCivilian(model, position, pedType);
	element.heading = heading;
	elements.data.peds.push({
		id:			element.id,
		model:		model,
		position:	position,
		heading:	heading,
		pedType:	pedType
	});
	return element;
};



elements.isObject = (elementId) => elements.getElementDataById('objects', elementId) != null;
elements.isVehicle = (elementId) => elements.getElementDataById('vehicles', elementId) != null;
elements.isPickup = (elementId) => elements.getElementDataById('pickups', elementId) != null;
elements.isSphere = (elementId) => elements.getElementDataById('spheres', elementId) != null;
elements.isPed = (elementId) => elements.getElementDataById('peds', elementId) != null;
elements.isBlip = (elementId) => elements.getElementDataById('blips', elementId) != null;


// load elements
xml.load(elements.gamePath(elements.paths.objects), 'Object', (data) => elements.createObject(util.int(data.model), util.vec3(data.position), util.vec3Rot(data.rotation, true)));
xml.load(elements.gamePath(elements.paths.vehicles), 'Vehicle', (data) => elements.createVehicle(util.int(data.model), util.vec3(data.position), util.vec3Rot(data.rotation, true)));
xml.load(elements.gamePath(elements.paths.pickups), 'Pickup', (data) => elements.createPickup(util.int(data.model), util.vec3(data.position)));
xml.load(elements.gamePath(elements.paths.spheres), 'Sphere', (data) => elements.createSphere(util.vec3(data.position), util.float(data.radius)));
xml.load(elements.gamePath(elements.paths.peds), 'Ped', (data) => elements.createPed(util.int(data.model), util.vec3(data.position), util.float(data.heading), util.int(data.pedType)));
xml.load(elements.gamePath(elements.paths.blips), 'Blip', (data) => elements.createBlip(util.int(data.icon), util.vec3(data.position), util.int(data.size), util.int(data.colour)));

xml.save(elements.gamePath(elements.paths.objects), 'Object', elements.data.objects, ['id', 'model', 'position', 'rotation']);
xml.save(elements.gamePath(elements.paths.vehicles), 'Vehicle', elements.data.vehicles, ['id', 'model', 'position', 'rotation']);
xml.save(elements.gamePath(elements.paths.pickups), 'Pickup', elements.data.pickups, ['id', 'model', 'position']);
xml.save(elements.gamePath(elements.paths.spheres), 'Sphere', elements.data.spheres, ['id', 'position', 'radius']);
xml.save(elements.gamePath(elements.paths.peds), 'Ped', elements.data.peds, ['id', 'model', 'position', 'heading', 'pedType']);
xml.save(elements.gamePath(elements.paths.blips), 'Blip', elements.data.blips, ['id', 'icon', 'position', 'size', 'colour']);




