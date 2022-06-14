// bind command callbacks
for(var k in cmds)
{
	commands.bind(k, cmds[k]);
}

// bind event callbacks
for(var k in events)
{
	if(k == 'onPlayerLogin' || k == 'onPlayerLogout')
		continue;

	let callbacks = events[k];
	for(var i in callbacks)
	{
		addEventHandler(k, callbacks[i]);
	}
}