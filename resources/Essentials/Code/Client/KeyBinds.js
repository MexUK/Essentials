global.keyBinds = {};

// events
addEventHandler('onKeyDown', (event, key) =>
{
	util.callServerFunction('keyBinds.onClientKeyDown', key);
});

