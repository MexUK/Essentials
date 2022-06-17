global.globalKeyBinds = {};

globalKeyBinds.keysDown = new Map();

// events
events.bind('onKeyDown', (event, key) =>
{
	if(!globalKeyBinds.keysDown.has(key))
	{
		globalKeyBinds.keysDown.set(key, true);
		util.callServerFunction('globalKeyBinds.onClientKeyDown', key);
	}
});

events.bind('onKeyUp', (event, key) =>
{
	if(globalKeyBinds.keysDown.has(key))
	{
		globalKeyBinds.keysDown.delete(key);
	}
});

