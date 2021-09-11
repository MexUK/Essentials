global.weapons = {};
global.cmds = global.cmds || {};

// commands
cmds.weapon = (client, _target, _weapon, _ammunition) =>
{
	var maxWeapon = 36;
	var maxAmmunition = 65535;
	var defaultAmmunition = 2500;
	
	[_target, _weapon, _ammunition] = util.grabArgs(client,
	[
		(v) => util.isClient(v),
		(v) => util.isInt(v) && util.between(util.int(v), 0, maxWeapon),
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
		return util.requestClientProperty(target, 'localPlayer.weapon', (weapon) => chat.all(target.name + "'s current weapon is " + util.getWeaponName(weapon) + "."));
	
	var weapon = util.int(_weapon, -1);
	if(weapon < 0 || weapon > maxWeapon)
		return chat.intBetween(client, 'Weapon', 0, maxWeapon, _weapon);
	
	var ammunition = util.int(_ammunition, -1);
	if(ammunition < 0 || ammunition > maxAmmunition)
		return chat.intBetween(client, 'Ammunition', 0, maxAmmunition, _ammunition);
	
	if(ammunition == defaultAmmunition)
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " to player " + target.name + ".");
	else
		chat.all(client.name + " gave weapon " + util.getWeaponName(weapon) + " with " + ammunition + " ammunition to player " + target.name + ".");
	util.callClientMethod(target, 'weapons.giveLocalPlayerWeapon', weapon, ammunition);
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

