global.elements = {};
global.cmds = global.cmds || {};

// commands
cmds.object = (client, _model, _radius) =>
{
	var maxModel = 8000;
	var maxRadius = 150.0;
	var defaultRadius = 20.0;
	
	[_model, _radius] = util.grabArgs(client,
	[
		(v) => util.isObjectModel(v),
		(v) => util.isFloat(v) && util.between(util.float(v), -maxRadius, maxRadius)
	],
	[
		undefined,
		defaultRadius
	], _model, _radius);
	
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(_model === undefined)
		return chat.pm(client, "You didn't type an object model.");
	
	var model = util.findObjectModel(_model);
	if(model < 0 || model > maxModel)
		return chat.intBetween(client, 'Object Model', 0, maxModel, _model);
	
	var radius = util.float(_radius);
	if(radius < -maxRadius || radius > maxRadius)
		return chat.intBetween(client, 'Radius', -maxRadius, maxRadius, _radius);
	
	if(radius == defaultRadius)
		chat.all(client.name + " added an object with model " + model + ".");
	else
		chat.all(client.name + " added an object " + radius + " units away with model " + model + ".");
	
	var position = client.player.position.addPolar(radius, client.player.heading + (Math.PI / 2.0));
	var rotation = new Vec3(0.0, 0.0, client.player.heading);
	
	
	elements.addObject(model, position, rotation);
};






elements.paths = {};

elements.paths.objects = 'data/scripts/elements/Objects.xml';

elements.addObject = (model, position, rotation) =>
{
	var element = elements.createObject(model, position, rotation);
	xml.add(elements.paths.objects, 'Object',
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
	return element;
};

xml.load(elements.paths.objects, 'Object', (data) => elements.createObject(util.int(data.model), util.vec3(data.position), util.vec3Rot(data.rotation, true)));

