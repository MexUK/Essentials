global.clientData = {};

clientData.clients = new Map();

// events
events.onPlayerJoined.push((event,client) =>
{
	clientData.clients[client.index] = {};
});

events.onPlayerQuit.push((event,client,type) =>
{
	clientData.clients[client.index] = undefined;
});

// string
clientData.set = (client, name, value) =>
{
	clientData.clients[client.index][name] = value;
};

clientData.unset = (client, name) =>
{
	clientData.clients[client.index][name] = undefined;
};

clientData.get = (client, name) =>
{
	return clientData.clients[client.index][name];
};

// array
clientData.setarr = (client, name, value) =>
{
	if(clientData.clients[client.index][name] === undefined)
		clientData.clients[client.index][name] = [value];
	else
		clientData.clients[client.index][name].push(value);
};

clientData.unsetarr = (client, name, value) =>
{
	if(clientData.clients[client.index][name] === undefined)
		return;
	var index = clientData.clients[client.index][name].indexOf(value);
	if(index != -1)
		clientData.clients[client.index][name].splice(index, 1);
	if(clientData.clients[client.index][name].length == 0)
		clientData.clients[client.index][name] = undefined;
};

// map
clientData.setmap = (client, name, key, value) =>
{
	if(clientData.clients[client.index][name] === undefined)
		clientData.clients[client.index][name] = new Map();
	clientData.clients[client.index][name][key] = value;
};

clientData.unsetmap = (client, name, key) =>
{
	if(clientData.clients[client.index][name] === undefined)
		return;
	clientData.clients[client.index][name][key] = undefined;
};

// clear
clientData.clear = (client) =>
{
	clientData.clients[client.index].elements.forEach(element => destroyElement(element));
	clientData.clients[client.index] = undefined;
};