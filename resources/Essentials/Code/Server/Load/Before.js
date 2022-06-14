global.cmds = {};
global.events = [];

events.onPlayerJoined = [];
events.onPlayerQuit = [];
events.onPedSpawn = [];
events.onPedWasted = [];
events.onPedExitVehicle = [];
events.onKeyDown = [];
events.onPlayerCommand = [];

events.onPlayerLogin = [];
events.onPlayerLogout = [];

events.trigger = (eventName, eventObject, ...args) =>
{
	let callbacks = events[eventName];
	if(callbacks === undefined)
		return;
	
	if(callbacks.length == 0)
		return;

	args.unshift(eventObject);
	for(var i in callbacks)
	{
		callbacks[i].apply(null, args);
	}
};