global.removeMode = global.removeMode || {};





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
	util.callClientFunction(client, 'removeMode.enable', elementName, util.objectsToArray(elements.data[elementName], ['id', 'model', 'position', 'rotation']));
	
	if(elementName == 'vehicles' && client.player && client.player.vehicle)
		removeMode.setElementById(client, client.player.vehicle.id);
};

removeMode.setElementById = (client, elementId) =>
{
	util.callClientFunction(client, 'removeMode.setElementById', elementId);
};

removeMode.disableRemoveMode = (client) =>
{
	clientData.set(client, 'removeMode', null);
	util.callClientFunction(client, 'removeMode.disable');
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
	switch(elementName)
	{
		case 'objects':		return elements.data.objects.map(v => v.id);
		case 'vehicles':	return elements.data.vehicles.map(v => v.id);
		case 'pickups':		return elements.data.pickups.map(v => v.id);
		case 'spheres':		return elements.data.spheres.map(v => v.id);
		case 'peds':		return elements.data.peds.map(v => v.id);
		case 'blips':		return elements.data.blips.map(v => v.id);
		default:			return [];
	}
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
	
	util.callClientFunction(client, 'removeMode.onElementRemoved', util.objectsToArray(elements.data[elementName], ['id', 'model', 'position', 'rotation']));
};