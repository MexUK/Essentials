global.globalKeyBinds = {};

// events
addEventHandler('onKeyDown', (event, key) =>
{
	util.callServerFunction('globalKeyBinds.onClientKeyDown', key);
});

