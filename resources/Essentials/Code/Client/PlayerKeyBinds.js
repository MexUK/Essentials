global.playerKeyBinds = {};

// events
addEventHandler('onKeyDown', (event, key) =>
{
	util.callServerFunction('playerKeyBinds.onClientKeyDown', key);
});

