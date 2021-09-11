global.vehicles = {};

// events
events.onPedExitVehicle.push((event, ped, vehicle, seat) =>
{
	if(ped.isType(ELEMENT_PLAYER))
	{
		var client = getClientFromPlayerElement(ped);
		if(clientData.get(client, 'vehicle') == vehicle)
		{
			clientData.unset(client, 'vehicle');
			clientData.unsetarr(client, 'elements', vehicle);
			destroyElement(vehicle);
		}
	}
});

// commands
cmds.v = (client, _model) =>
{
	if(!client.player)
		return chat.notSpawned(client);
	
	var vehicleModelId = util.findVehicleModelId(_model, 191);
	if(vehicleModelId == -1)
		return chat.invalidModel(client, ELEMENT_VEHICLE, _model);
	
	var position = client.player.position.addPolar(2.5, client.player.heading + util.radians(90.0));
	var vehicle = gta.createVehicle(vehicleModelId, position);
	vehicle.heading = client.player.heading;
	
	client.player.warpIntoVehicle(vehicle, 0);
	
	clientData.setarr(client, 'elements', vehicle);
	clientData.set(client, 'vehicle', vehicle);
};