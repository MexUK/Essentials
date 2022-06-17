global.playerKeyBinds = {};

playerKeyBinds.keysDown = new Map();

// events
addEventHandler('onKeyDown', (event, key) =>
{
	if(!playerKeyBinds.keysDown.has(key))
	{
		playerKeyBinds.keysDown.set(key, true);
		util.callServerFunction('playerKeyBinds.onClientKeyDown', key);
	}
});

addEventHandler('onKeyUp', (event, key) =>
{
	if(playerKeyBinds.keysDown.has(key))
	{
		playerKeyBinds.keysDown.delete(key);
	}
});

