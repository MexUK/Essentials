global.joinQuit = {};

// events
events.onPlayerJoined.push((e,c) =>
{
	message(c.name+' has joined.');
});

events.onPlayerQuit.push((e,c) =>
{
	message(c.name+' has left.');
});

