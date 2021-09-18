global.tempVehicles = {};

global.tempVehicles.clientVehicleKey = 'tempVehicle';
global.tempVehicles.clientElementsKey = 'elements';

// events
events.onPedExitVehicle.push((event, ped, vehicle, seat) =>
{
	if(ped.isType(ELEMENT_PLAYER))
	{
		var client = getClientFromPlayerElement(ped);
		
		if(!tempVehicles.hasVehicle(client))
			return;
		
		if(tempVehicles.getVehicle(client) == vehicle)
		{
			tempVehicles.removeVehicle(client);
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
	
	if(tempVehicles.hasVehicle(client))
	{
		tempVehicles.removeVehicle(client);
	}
	
	var position = client.player.position.addPolar(2.5, client.player.heading + util.radians(90.0));
	var vehicle = gta.createVehicle(vehicleModelId, position);
	vehicle.heading = client.player.heading;
	
	chat.all(client.name + ' added temporary vehicle ' + util.getVehicleModelName(vehicleModelId) + ". (Vehicle ID " + vehicle.id + ")");
	
	client.player.warpIntoVehicle(vehicle, 0);
	
	clientData.setarr(client, global.tempVehicles.clientElementsKey, vehicle);
	clientData.set(client, global.tempVehicles.clientVehicleKey, vehicle);
};

// api
tempVehicles.removeVehicle = (client) =>
{
	var vehicle = tempVehicles.getVehicle(client);
	if(!vehicle)
		return;
	
	clientData.unset(client, global.tempVehicles.clientVehicleKey);
	clientData.unsetarr(client, global.tempVehicles.clientElementsKey, vehicle);
	destroyElement(vehicle);
};

tempVehicles.getVehicle = (client) =>
{
	return clientData.get(client, global.tempVehicles.clientVehicleKey);
};

tempVehicles.hasVehicle = (client) =>
{
	return tempVehicles.getVehicle(client) != null;
};

