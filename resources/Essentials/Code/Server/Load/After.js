for(var k in cmds)
{
	util.bindCommand(k, cmds[k]);
}

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