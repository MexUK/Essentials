global.events = {};

events.events = {};

events.custom = util.arrayToKeysLower([
	'onPlayerLogin',
	'onPlayerlogout'
]);

// bind/unbind
events.bind = (eventName, callback) =>
{
	let isCustomEvent = events.custom[eventName.toLowerCase()] !== undefined;
	let data = [callback, isCustomEvent];
	if(events.events[eventName])
		events.events[eventName].push(data);
	else
		events.events[eventName] = [data];
};

events.bindAll = () =>
{
	for(var eventName in events.events)
	{
		let entries = events.events[eventName];
		for(var i in entries)
		{
			if(!entries[i][1])
			{
				addEventHandler(eventName, entries[i][0]);
			}
		}
	}
};

// bind/unbind now
events.bindNow = (eventName, callback) =>
{
	addEventHandler(eventName, callback);
};

events.unbindNow = (eventName/*, callback*/) =>
{
	removeEventHandler(eventName);
};

// trigger
events.trigger = (eventName, eventObject, ...args) =>
{
	let entries = events.events[eventName];
	if(entries === undefined)
		return;
	
	if(entries.length == 0)
		return;

	args.unshift(eventObject);
	for(var i in entries)
	{
		entries[i][0].apply(null, args);
	}
};

{
	util.exportAll('events', events);
}

