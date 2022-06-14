for(var k in cmds)
{
	util.bindCommand(k, cmds[k]);
}

for(var k in events)
{
	for(var i in events[k])
	{
		addEventHandler(k, events[k][i]);
	}
}