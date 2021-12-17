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
	var vehicle = util.getNearestVehicle(localPlayer.position);
	if(!vehicle)
		return;
	
	localPlayer.enterVehicle(vehicle, false);
};

