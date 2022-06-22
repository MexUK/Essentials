global.blips = {};

blips.players = {};
blips.vehicles = {};

// events
events.bind('onPlayerJoin', (event, client) =>
{
	let colour = util.getRandomRGBInt();
	cd.set(client, 'colour', colour);
});

events.bind('onPlayerQuit', (event, client, disconnectType) =>
{
	blips.removeClientBlip(client);
});

events.bind('onPedSpawn', (event, ped) =>
{
	if(ped.isType(ELEMENT_PLAYER))
	{
		let client = getClientFromPlayerElement(ped);
		if(client)
		{
			blips.addClientBlip(client);
		}
	}
});

events.bind('onPedWasted', (event, wastedPed, attackerPed, weapon, pedPiece) =>
{
	if(wastedPed.isType(ELEMENT_PLAYER))
	{
		let client = getClientFromPlayerElement(wastedPed);
		if(client)
		{
			blips.removeClientBlip(client);
		}
	}
});

// commands
cmds.playerblips = (client, _status) =>
{
	let currentStatus = gd.get('playerBlips');

	if(_status === undefined)
		return chat.all("Player blips are turned "+(currentStatus ? 'on' : 'off')+'.');
	
	let status = util.bool(_status);

	if(status)
	{
		if(currentStatus)
			return chat.pm(client, "Player blips are already turned on.");

		chat.all(client.name+" turned on player blips.");
		blips.addAllClientsBlips();
		gd.save({playerBlips: true});
	}
	else
	{
		if(!currentStatus)
			return chat.pm(client, "Player blips are already turned off.");

		chat.all(client.name+" turned off player blips.");
		blips.removeAllClientsBlips();
		gd.save({playerBlips: false});
	}
}

// add/remove single client blip
blips.addClientBlip = (client) =>
{
	let colour = cd.get(client, 'colour');
	if(!colour)
		colour = 0xFF8800FF;
	let blip = gta.createBlipAttachedTo(client.player, 0, 2, colour, true, false);
	if(blip)
	{
		cd.set(client, 'blip', blip);
	}
};

blips.removeClientBlip = (client) =>
{
	let blip = cd.get(client, 'blip');
	if(blip)
	{
		destroyElement(blip);
		cd.unset(client, 'blip');
	}
};

// add/remove all clients blips
blips.addAllClientsBlips = () =>
{
	getClients().forEach(client => blips.addClientBlip(client));
};

blips.removeAllClientsBlips = () =>
{
	getClients().forEach(client => blips.removeClientBlip(client));
};

