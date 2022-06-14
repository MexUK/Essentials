global.weapons = {};

weapons.giveLocalPlayerWeapon = function(weapon, ammunition)
{
	if(!localClient.player)
		return;
	
	localPlayer.giveWeapon(weapon, ammunition, true);
};

weapons.clearLocalPlayerWeapons = function()
{
	if(!localClient.player)
		return;
	
	localPlayer.clearWeapons();
};

