global.passenger = {};

addEventHandler('onKeyDown', (event,key) =>
{
	if(key == SDLK_g && localClient.player && !localPlayer.vehicle)
	{
		passenger.enterNearestVehicle();
	}
});

passenger.enterNearestVehicle = () =>
{
	var vehicle = passenger.getNearestVehicle();
	if(!vehicle)
		return;
	
	localPlayer.enterVehicle(vehicle, false);
};

passenger.getNearestVehicle = () =>
{
	var vehicles = getVehicles();
	var localPlayerPosition = localPlayer.position;
	var nearestVehicle = null;
	var vehDis, nearestVehDis = 99999.999;
	for(var i=0,j=vehicles.length; i<j; i++)
	{
		vehDis = vehicles[i].position.distance(localPlayerPosition);
		if(vehDis < nearestVehDis)
		{
			nearestVehDis = vehDis;
			nearestVehicle = vehicles[i];
		}
	}
	return nearestVehicle;
};

