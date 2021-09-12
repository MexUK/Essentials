global.elements = {};
global.cmds = global.cmds || {};

elements.MAX_OBJECTS = 2048;
elements.MAX_VEHICLES = 512;
elements.MAX_PICKUPS = 330;
elements.MAX_SPHERES = 127;
elements.MAX_BLIPS = 127;
elements.MAX_PEDS = 512 - server.maxClients;

elements.gameFolderNames =
[
	'unknown',
	'iii',
	'vc',
	'sa',
	'iv'
];

// commands
cmds.object = (client, _model, _distanceAway) =>
{
	if(elements.data.objects.length > elements.MAX_OBJECTS)
		return chat.pm(client, 'Max amount of objects already reached! (' + elements.data.objects.length + '/' + elements.MAX_OBJECTS + ')');
	
	var minModel = getMinObjectModel();
	var maxModel = getMaxObjectModel();
	var maxDistanceAway = 150.0;
	var defaultDistanceAway = 20.0;
	
	[_model, _distanceAway] = util.grabArgs(client,
	[
		(v) => util.isObjectModel(v),
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
		(v) => util.isObjectModel(v),
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
		(v) => util.isPedModel(v),
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
		(v) => util.isBlipIcon(v),
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
cmds.maxpeds = (client) => chat.all('Max peds (excluding ' + server.maxClients + ' player peds): ' + elements.MAX_PEDS);
cmds.maxblips = (client) => chat.all('Max blips: ' + elements.MAX_BLIPS);









elements.gamePath = (path) =>
{
	var folderName = elements.gameFolderNames[server.game];
	if(!folderName)
		folderName = 'UnknownGame';
	return util.format(path, folderName);
};










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

// objects
elements.addObject = (model, position, rotation) =>
{
	var element = elements.createObject(model, position, rotation);
	xml.add(elements.gamePath(elements.paths.objects), 'Object',
	{
		model:		model,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
	return element;
};
elements.createObject = (model, position, rotation) =>
{
	var element = gta.createObject(model, position);
	element.setRotation(rotation);
	elements.data.objects.push({
		model:		model,
		position:	position,
		rotation:	rotation
	});
	return element;
};

// vehicles
elements.addVehicle = (model, position, rotation) =>
{
	var element = elements.createVehicle(model, position, rotation);
	xml.add(elements.gamePath(elements.paths.vehicles), 'Vehicle',
	{
		model:		model,
		position:	util.posArray(position).join(','),
		rotation:	util.rotArray(rotation, true).join(',')
	});
	return element;
};
elements.createVehicle = (model, position, rotation) =>
{
	var element = gta.createVehicle(model, position);
	element.setRotation(rotation);
	elements.data.vehicles.push({
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
		model:		model,
		position:	util.posArray(position).join(',')
	});
	return element;
};
elements.createPickup = (model, position) =>
{
	var element = gta.createPickup(model, position);
	elements.data.pickups.push({
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
		position:	util.posArray(position).join(','),
		radius:		radius
	});
	return element;
};
elements.createSphere = (position, radius) =>
{
	var element = gta.createSphere(position, radius);
	elements.data.spheres.push({
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
		icon:		icon,
		position:	util.posArray(position).join(','),
		size:		size,
		colour:		colour
	});
	return element;
};
elements.createBlip = (icon, position, size, colour) =>
{
	var element = gta.createBlip(icon, position, size, colour);
	element.position = position;
	elements.data.blips.push({
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
		model:		model,
		position:	util.posArray(position).join(','),
		heading:	heading,
		pedType:	pedType
	});
	return element;
};
elements.createPed = (model, position, heading, pedType) =>
{
	var element = gta.createCivilian(model, position, pedType);
	element.heading = heading;
	elements.data.peds.push({
		model:		model,
		position:	position,
		heading:	heading,
		pedType:	pedType
	});
	return element;
};

// load elements
xml.load(elements.gamePath(elements.paths.objects), 'Object', (data) => elements.createObject(util.int(data.model), util.vec3(data.position), util.vec3Rot(data.rotation, true)));
xml.load(elements.gamePath(elements.paths.vehicles), 'Vehicle', (data) => elements.createVehicle(util.int(data.model), util.vec3(data.position), util.vec3Rot(data.rotation, true)));
xml.load(elements.gamePath(elements.paths.pickups), 'Pickup', (data) => elements.createPickup(util.int(data.model), util.vec3(data.position)));
xml.load(elements.gamePath(elements.paths.spheres), 'Sphere', (data) => elements.createSphere(util.vec3(data.position), util.float(data.radius)));
xml.load(elements.gamePath(elements.paths.peds), 'Ped', (data) => elements.createPed(util.int(data.model), util.vec3(data.position), util.float(data.heading), util.int(data.pedType)));
xml.load(elements.gamePath(elements.paths.blips), 'Blip', (data) => elements.createBlip(util.int(data.icon), util.vec3(data.position), util.int(data.size), util.int(data.colour)));





