global.cd = {};

cd.clients = {};
cd.array = {};
cd.map = {};

cd.path = 'Data/Global/AccountData.xml';
cd.rootTag = 'Player';




// events
var addPlayerCB = (event, client) =>
{
	cd.clients[client.index] = {};
	cd.load(client);
};

events.bind('onPlayerJoined', addPlayerCB);
events.bind('onPlayerQuit', (event, client, type) =>
{
	delete cd.clients[client.index];
});




// load
(() => getClients().forEach(client => addPlayerCB(null, client)))();




// string
cd.set = (client, name, value) =>
{
	cd.clients[client.index][name] = value;
};

cd.setAll = (client, values) =>
{
	for(var name in values)
		cd.clients[client.index][name] = values[name];
};

cd.unset = (client, name) =>
{
	delete cd.clients[client.index][name];
};

cd.get = (client, name) =>
{
	return cd.clients[client.index][name];
};

cd.has = (client, name) =>
{
	return cd.clients[client.index][name] !== undefined;
};

// string + disk
cd.save = (client, saveData) =>
{
	for(var k in saveData)
		cd.clients[client.index][k] = saveData[k];
	xml.attr.set(cd.path, cd.rootTag, { name: client.name.toLowerCase() }, saveData);
};

cd.load = (client) =>
{
	cd.setAll(client, xml.attr.getAll(cd.path, cd.rootTag, { name: client.name.toLowerCase() }));
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
		delete cd.clients[client.index][name];
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
	delete cd.clients[client.index];
};

{
	util.exportAll('cd', cd);
}