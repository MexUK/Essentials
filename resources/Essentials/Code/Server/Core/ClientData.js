global.cd = {};

cd.clients = {};
cd.array = {};
cd.map = {};




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
cd.array.set = (client, name, value) =>
{
	if(cd.clients[client.index][name] === undefined)
		cd.clients[client.index][name] = [value];
	else
		cd.clients[client.index][name].push(value);
};

cd.array.unset = (client, name, value) =>
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
cd.map.set = (client, name, key, value) =>
{
	if(cd.clients[client.index][name] === undefined)
		cd.clients[client.index][name] = new Map();
	cd.clients[client.index][name].set(key, value);
};

cd.map.unset = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	cd.clients[client.index][name].delete(key);
};

cd.map.clear = (client, name) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	cd.clients[client.index][name].clear();
};

cd.map.get = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return;
	return cd.clients[client.index][name].get(key);
};

cd.map.has = (client, name, key) =>
{
	if(cd.clients[client.index][name] === undefined)
		return false;
	return cd.clients[client.index][name].has(key);
};

cd.map.getContainer = (client, name) =>
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