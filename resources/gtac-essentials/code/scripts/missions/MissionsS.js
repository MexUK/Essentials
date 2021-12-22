global.missions = {};

// commands
cmds.mission = (client, _missionId, ..._targets) =>
{
	if(_missionId === undefined)
		return chat.pm(client, "You didn't type a mission ID.");
	
	var missionId = util.int(_missionId);
	if(missionId < 0 || missionId > 500)
		return chat.pm(client, 'Invalid mission ID.');
	
	var clients = [client];
	
	if(_targets.length > 0)
	{
		_targets.forEach(_target =>
		{
			var target = util.findClient(_target, null);
			
			if(!target)
				return chat.pm(client, "Couldn't find player: " + _target);
			
			if(!target.player)
				return chat.pm(client, "Player isn't spawned: " + target.name);
			
			clients.push(target);
		});
	}
	
	/*
	util.getVariableFromClients(clients, 'gta.onMission', (dataFromClients) =>
	{
		var playerNameOnMission = null;
		
		states.forEach((state, clientId) =>
		{
			if(state)
			{
				playerNameOnMission = clients[clientId].name;
			}
		});
		
		if(playerNameOnMission)
			return chat.pm(client, playerNameOnMission + " is already on a mission.");
		
		if(clients.length == 1)
			chat.all(client.name + ' started mission ID ' + missionId + ' by themself.');
		else
			chat.all(client.name + ' started mission ID ' + missionId + ' with players: ' + clients.map(client => client.name).join(', ') + '.');
		clients.forEach(client => util.callClientFunction(client, 'gta.startMission', missionId));
	}), (failedClients) =>
	{
		return chat.pm(client, "Failed to detect current mission status for players: " + failedClients.map(failedClient => failedClient.name).join(', '));
	});
	*/
	
	var states = new Map();
	clients.forEach(client2 =>
	{
		util.requestClientVariable(client2, 'gta.onMission', (state) =>
		{
			states.set(client2.index, state);
			
			var count = 0;
			states.forEach(v => count++);
			
			if(clients.length == count)
			{
				var playerNameOnMission = null;
				
				states.forEach((state, clientId) =>
				{
					if(state)
					{
						playerNameOnMission = clients[clientId].name;
					}
				});
				
				if(playerNameOnMission)
					return chat.pm(client, playerNameOnMission + " is already on a mission.");
				
				if(clients.length == 1)
					chat.all(client.name + ' started mission ID ' + missionId + ' by themself.');
				else
					chat.all(client.name + ' started mission ID ' + missionId + ' with players: ' + clients.map(client => client.name).join(', ') + '.');
				clients.forEach(client => util.callClientFunction(client, 'gta.startMission', missionId));
			}
		});
	});
};

cmds.cancelmission = (client) =>
{
	util.requestClientVariable(client, 'gta.onMission', (state) =>
	{
		if(!state)
			return chat.pm(client, "You are not on a mission.");
			
		chat.all(client.name + ' cancelled their mission.');
		util.callClientFunction(client, 'gta.cancelMission', true);
	});
};

cmds.onmission = (client, _target) =>
{
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	util.requestClientVariable(target, 'gta.onMission', (state) =>
	{
		chat.all(target.name + ' is ' + (state ? '' : 'not ') + 'on a mission.');
	});
};

