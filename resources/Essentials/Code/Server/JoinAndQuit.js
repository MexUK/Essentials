global.joinQuit = {};

// events
events.bind('onPlayerJoined', (event, client) =>
{
	message(client.name+' has joined.');
});

events.bind('onPlayerQuit', (event, client, type) =>
{
	message(client.name+' has left.');
});

