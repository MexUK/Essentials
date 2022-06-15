global.cn = {};

// events
setImmediate(() =>
{
	events.bind('onPlayerQuit', (event, client, type) =>
	{
		util.killClientTimer(client);
		util.removePendingRequestedClientData(client);
	});
});