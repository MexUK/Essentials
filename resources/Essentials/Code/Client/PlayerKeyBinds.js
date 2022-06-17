global.playerKeyBinds = {};

playerKeyBinds.keysDown = new Map();

// events
events.bind('onKeyDown', (event, key) =>
{
	if(!playerKeyBinds.keysDown.has(key))
	{
		playerKeyBinds.keysDown.set(key, true);
		util.callServerFunction('playerKeyBinds.onClientKeyDown', key);
	}
});

events.bind('onKeyUp', (event, key) =>
{
	if(playerKeyBinds.keysDown.has(key))
	{
		playerKeyBinds.keysDown.delete(key);
	}
});

