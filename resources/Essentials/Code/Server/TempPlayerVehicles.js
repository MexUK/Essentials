global.tempPlayerVehicles = {};

global.tempPlayerVehicles.clientVehicleKey = 'tempVehicle';
global.tempPlayerVehicles.clientElementsKey = 'elements';

// events
events.bind('onPedExitVehicle', (event, ped, vehicle, seat) =>
{
	if(ped.isType(ELEMENT_PLAYER))
	{
		var client = getClientFromPlayerElement(ped);
		
		if(client)
		{
			if(!tempPlayerVehicles.hasVehicle(client))
				return;
			
			if(tempPlayerVehicles.getVehicle(client) == vehicle)
			{
				tempPlayerVehicles.removeVehicle(client);
			}
		}
	}
});

// commands
cmds.tempvehicle = (client, _model) =>
{
	if(!client.player)
		return chat.notSpawned(client);
	
	var vehicleModelId = util.findVehicleModel(_model, 191);
	if(vehicleModelId == -1)
		return chat.invalidModel(client, ELEMENT_VEHICLE, _model);
	
	if(tempPlayerVehicles.hasVehicle(client))
	{
		tempPlayerVehicles.removeVehicle(client);
	}
	
	var position = client.player.position.addPolar(2.5, client.player.heading + util.radians(90.0));
	var vehicle = gta.createVehicle(vehicleModelId, position);
	vehicle.heading = client.player.heading;
	
	chat.all(client.name + ' added a temporary player vehicle ' + util.getVehicleModelName(vehicleModelId) + ". (Vehicle ID " + vehicle.id + ")");
	
	client.player.warpIntoVehicle(vehicle, 0);
	
	cd.array.set(client, global.tempPlayerVehicles.clientElementsKey, vehicle);
	cd.set(client, global.tempPlayerVehicles.clientVehicleKey, vehicle);
};

// api
tempPlayerVehicles.removeVehicle = (client) =>
{
	var vehicle = tempPlayerVehicles.getVehicle(client);
	if(!vehicle)
		return;
	
	cd.unset(client, global.tempPlayerVehicles.clientVehicleKey);
	cd.array.unset(client, global.tempPlayerVehicles.clientElementsKey, vehicle);
	destroyElement(vehicle);
};

tempPlayerVehicles.getVehicle = (client) =>
{
	return cd.get(client, global.tempPlayerVehicles.clientVehicleKey);
};

tempPlayerVehicles.hasVehicle = (client) =>
{
	return tempPlayerVehicles.getVehicle(client) != null;
};

