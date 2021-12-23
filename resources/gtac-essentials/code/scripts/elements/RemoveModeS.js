global.removeMode = global.removeMode || {};

removeMode.attr = {};
removeMode.attr.objects = ['id', 'model', 'position', 'rotation'];
removeMode.attr.vehicles = ['id', 'model', 'position', 'rotation'];
removeMode.attr.pickups = ['id', 'model', 'position', 'rotation'];
removeMode.attr.spheres = ['id', null, 'position', 'rotation'];
removeMode.attr.peds = ['id', 'model', 'position', 'rotation'];
removeMode.attr.blips = ['id', 'icon', 'position', 'rotation'];



removeMode.isAnyRemoveModeEnabled = (client) =>
{
	return clientData.get(client, 'removeMode') != null;
};

removeMode.isRemoveModeEnabled = (client, elementName) =>
{
	return clientData.get(client, 'removeMode') == elementName;
};

removeMode.enableRemoveMode = (client, elementName) =>
{
	if(mapper.isEnabled(client))
		mapper.setDisabled(client);
	
	clientData.set(client, 'removeMode', elementName);
	util.callClientFunction(client, 'removeMode.enable', elementName, removeMode.getElementsData(elementName));
	
	if(elementName == 'vehicles' && client.player && client.player.vehicle)
		removeMode.setElementById(client, client.player.vehicle.id);
};

removeMode.disableRemoveMode = (client) =>
{
	clientData.set(client, 'removeMode', null);
	util.callClientFunction(client, 'removeMode.disable');
};

removeMode.setElementById = (client, elementId) =>
{
	util.callClientFunction(client, 'removeMode.setElementById', elementId);
};

removeMode.getClientsInRemoveMode = (elementName) =>
{
	var clients = [];
	getClients().forEach(client2 =>
	{
		if(elementName == clientData.get(client2, 'removeMode'))
		{
			clients.push(client2);
		}
	});
	return clients;
};

removeMode.getElementName = (elementName) =>
{
	switch(elementName)
	{
		case 'objects':		return 'Object';
		case 'vehicles':	return 'Vehicle';
		case 'pickups':		return 'Pickup';
		case 'spheres':		return 'Marker';
		case 'peds':		return 'Ped';
		case 'blips':		return 'Blip';
		default:			return 'Unknown';
	}
};

removeMode.getElementIds = (elementName) =>
{
	if(elements.data[elementName] === undefined)
		return [];
	return elements.data[elementName].map(v => v.id);
};

removeMode.removeElement = (client, elementName, elementId) =>
{
	if(!removeMode.isRemoveModeEnabled(client, elementName))
		return;
	
	chat.all(client.name + ' removed ' + removeMode.getElementName(elementName).toLowerCase() + ' with ID ' + elementId + '.');
	
	switch(elementName)
	{
		case 'objects':
			if(!elements.isObject(elementId))
				return;
			elements.removeObject(elementId);
			break;
		case 'vehicles':
			if(!elements.isVehicle(elementId))
				return;
			elements.removeVehicle(elementId);
			break;
		case 'pickups':
			if(!elements.isPickup(elementId))
				return;
			elements.removePickup(elementId);
			break;
		case 'spheres':
			if(!elements.isSphere(elementId))
				return;
			elements.removeSphere(elementId);
			break;
		case 'peds':
			if(!elements.isPed(elementId))
				return;
			elements.removePed(elementId);
			break;
		case 'blips':
			if(!elements.isBlip(elementId))
				return;
			elements.removeBlip(elementId);
			break;
	}
	
	removeMode.onElementRemoved(elementName);
};

removeMode.getElementsData = (elementName) =>
{
	return util.objectsToArray(elements.data[elementName], removeMode.attr[elementName]);
};

removeMode.onElementRemoved = (elementName) =>
{
	util.callClientFunctionForMultiple(
		removeMode.getClientsInRemoveMode(elementName),
		'removeMode.onElementRemoved',
		removeMode.getElementsData(elementName)
	);
};

