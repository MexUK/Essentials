global.mapper = {};

mapper.maps = [];

// events
bindEventHandler('onResourceStart', thisResource, function()
{
	//mapper.loadAllMaps();
});

mapper.storeActiveObject = (client, objectId, modelId, position, rotation) =>
{
	if(!clientData.get(client, 'mapper'))
		return;
	
	var object = getElementFromId(objectId);
	if(object)
	{
		object.syncer = client.id;
		elements.setObjectPositionRotation(objectId, position, rotation);
	}
	else
	{
		elements.addObject(modelId, position, rotation);
	}
};

// commands
cmds.mapper = (client, _model) =>
{
	if(!client.player)
		return chat.notSpawned(client, client);
	
	if(clientData.get(client, 'mapper'))
	{
		clientData.set(client, 'mapper', 0);
		mapper.toggleMapEditor(client, 0);
	}
	else
	{
		clientData.set(client, 'mapper', 1);
		var model = _model ? util.int(model) : 583; 
		mapper.toggleMapEditor(client, model + '');
	}
};










// map editor
mapper.toggleMapEditor = (client, model) =>
{
	util.callClientFunction(client, 'mapper.toggleMapEditor', model);
};

// map existence
mapper.addMap = function(mapName)
{
	var map = {
		name: mapName,
		objects: []
	};
	mapper.maps.push(map);
	return map;
};

// all maps
mapper.loadAllMaps = function()
{
};

// map
mapper.getMapPath = function(mapName)
{
	return 'Data/Maps/'+mapName+'.txt';
};

mapper.loadMap = function(mapName)
{
	var lines = utility.getFileLines(openFile(mapper.getMapPath(mapName)));
	var map = mapper.addMap(mapName);
	for(var i in lines)
	{
		var data = lines[i].split("\t");
		
		if(data[0].toLowerCase() == 'object')
		{
			var object = mapper.loadMapObject(data);
			if(object)
			{
				map.objects.push(object);
			}
		}
	}
};

mapper.unloadMap = function()
{
};

mapper.loadMapObject = function(data)
{
	if(data.length < 5)
		return false;
	
	var object = gta.createObject(
		parseInt(data[1]),
		new Vec3(
			parseFloat(data[2]),
			parseFloat(data[3]),
			parseFloat(data[4])
		)
	);
	if(!object)
		return false;
	
	if(data.length >= 8)
	{
		object.setRotation(new Vec3(
			parseFloat(data[5]),
			parseFloat(data[6]),
			parseFloat(data[7])
		));
	}
	
	return object;
};

