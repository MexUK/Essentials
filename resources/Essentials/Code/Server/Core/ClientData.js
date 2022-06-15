global.cd = {};

cd.clients = {};




// events
var addPlayerCB = (event, client) =>
{
	cd.clients[client.index] = {};
};

events.bind('onPlayerJoined', addPlayerCB);
events.bind('onPlayerQuit', (event, client, type) =>
{
	cd.clients[client.index] = undefined;
});




// load
(() => getClients().forEach(client => addPlayerCB(null, client)))();




// string
cd.set = (client, name, value) =>
{
	cd.clients[client.index][name] = value;
};

cd.unset = (client, name) =>
{
	cd.clients[client.index][name] = undefined;
};

cd.get = (client, name) =>
{
	return cd.clients[client.index][name];
};

cd.has = (client, name) =>
{
	return cd.clients[client.index][name] !== undefined;
};

// array
cd.setarr = (client, name, value) =>
{
	if(cd.clients[client.index][name] === undefined)
		cd.clients[client.index][name] = [value];
	else
		cd.clients[client.index][name].push(value);
};

cd.unsetarr = (client, name, value) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	var index = cd.clients[client.index][name].indexOf(value);
	if(index != -1)
		cd.clients[client.index][name].splice(index, 1);
	if(cd.clients[client.index][name].length == 0)
		cd.clients[client.index][name] = undefined;
};

// map
cd.setmap = (client, name, key, value) =>
{
	if(cd.clients[client.index][name] === undefined)
		cd.clients[client.index][name] = new Map();
	cd.clients[client.index][name].set(key, value);
};

cd.unsetmap = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	cd.clients[client.index][name].delete(key);
};

cd.clearmap = (client, name) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	cd.clients[client.index][name].clear();
};

cd.getmap = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	return cd.clients[client.index][name].get(key);
};

cd.hasmap = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return false;
	return cd.clients[client.index][name].has(key);
};

cd.getmapcontainer = (client, name) =>
{
	if(cd.clients[client.index][name] === undefined)
		cd.clients[client.index][name] = new Map();
	return cd.clients[client.index][name];
};

// clear
cd.clear = (client) =>
{
	cd.clients[client.index].elements.forEach(element => destroyElement(element));
	cd.clients[client.index] = undefined;
};