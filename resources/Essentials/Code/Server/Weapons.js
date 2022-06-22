global.weapons = {};
global.cmds = global.cmds || {};

// commands
cmds.weapon = (client, _target) =>
{
	var maxAmmunition = 65535;
	var defaultAmmunition = 2500;
	
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v)
	],
	[
		client.name
	], _target);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientProperty(target, 'localPlayer.weapon', (weapon) => chat.all(target.name + "'s current weapon is " + util.getWeaponName(weapon) + "."));
};

cmds.giveweapon = (client, _target, _weapon, _ammunition) =>
{
	var maxAmmunition = 65535;
	var defaultAmmunition = 2500;
	
	[_target, _weapon, _ammunition] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isWeapon(v),
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxAmmunition)
	],
	[
		client.name,
		undefined,
		defaultAmmunition
	], _target, _weapon, _ammunition);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	if(_weapon === undefined)
		return chat.pm(client, "You didn't specify a weapon.");
	
	var weapon = util.findWeapon(_weapon);
	if(weapon == -1)
		return chat.invalidWeapon(client, _weapon);
	
	var ammunition = util.int(_ammunition, -1);
	if(ammunition < 0 || ammunition > maxAmmunition)
		return chat.intBetween(client, 'Ammunition', 0, maxAmmunition, _ammunition);
	
	if(ammunition == defaultAmmunition)
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " to player " + target.name + ".");
	else
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " with " + ammunition + " ammunition to player " + target.name + ".");
	util.callClientMethod(target, 'weapons.giveLocalPlayerWeapon', weapon, ammunition);
};

cmds.giveallweapon = (client, _weapon, _ammunition) =>
{
	var maxAmmunition = 65535;
	var defaultAmmunition = 2500;
	
	[_weapon, _ammunition] = util.grabArgs(client,
	[
		(v) => util.isWeapon(v),
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxAmmunition)
	],
	[
		undefined,
		defaultAmmunition
	], _weapon, _ammunition);
	
	if(_weapon === undefined)
		return chat.pm(client, "You didn't specify a weapon.");
	
	var weapon = util.findWeapon(_weapon);
	if(weapon == -1)
		return chat.invalidWeapon(client, _weapon);
	
	var ammunition = util.int(_ammunition, -1);
	if(ammunition < 0 || ammunition > maxAmmunition)
		return chat.intBetween(client, 'Ammunition', 0, maxAmmunition, _ammunition);
	
	if(ammunition == defaultAmmunition)
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " to all players.");
	else
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " with " + ammunition + " ammunition to all players.");
	util.callClientMethodForAll('weapons.giveLocalPlayerWeapon', weapon, ammunition);
};

cmds.clearweapons = (client, _target) =>
{
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v)
	],
	[
		client.name
	], _target);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	chat.all(client.name + " cleared player " + target.name + "'s weapons.");
	util.callClientMethod(target, 'weapons.clearLocalPlayerWeapons');
};

cmds.weapons = (client, _target) =>
{
	[_target] = util.grabArgs(client,
	[
		(v) => util.isClient(v)
	],
	[
		client.name
	], _target);
	
	var target = util.findClient(_target, client);
	if(!target)
		return chat.invalidClient(client, _target);
	
	if(!target.player)
		return chat.notSpawned(client, target);
	
	util.requestClientProperty(target, 'localPlayer.weapons', (weapons) => chat.all(target.name + "'s weapons: " + weapons.map(v => util.getWeaponName(v)).join(', ') + "."));
};

