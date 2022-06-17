global.globalKeyBinds = {};

globalKeyBinds.keysDown = new Map();

// events
addEventHandler('onKeyDown', (event, key) =>
{
	if(!globalKeyBinds.keysDown.has(key))
	{
		globalKeyBinds.keysDown.set(key, true);
		util.callServerFunction('globalKeyBinds.onClientKeyDown', key);
	}
});

addEventHandler('onKeyUp', (event, key) =>
{
	if(globalKeyBinds.keysDown.has(key))
	{
		globalKeyBinds.keysDown.delete(key);
	}
});

