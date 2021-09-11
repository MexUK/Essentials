global.commandAliases = {};
commandAliases.commandAliases = [];

(commandAliases.load = () =>
{
	var root = util.loadXMLRoot('data/scripts/command-aliases/CommandAliases.xml');
	
	commandAliases.commandAliases = util.getXMLArray(root, 'alias', (v) => v);
	
	commandAliases.commandAliases.forEach(v =>
	{
		cmds[v.alias] = cmds[v.command];
		util.bindCommand(v.alias, cmds[v.command]);
	});
})();