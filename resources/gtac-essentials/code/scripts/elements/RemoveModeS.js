global.removeMode = global.removeMode || {};

global._ELEMENT_MARKER = 8194;

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

removeMode.isRemoveModeEnabled = (client, elementType) =>
{
	return clientData.get(client, 'removeMode') == elementType;
};

removeMode.enableRemoveMode = (client, elementType) =>
{
	if(mapper.isEnabled(client))
		mapper.setDisabled(client);
	
	clientData.set(client, 'removeMode', elementType);
	util.callClientFunction(client, 'removeMode.enable', elementType, removeMode.getElementsData(elementType));
	
	if(elementType == ELEMENT_VEHICLE && client.player && client.player.vehicle)
		removeMode.setElementById(client, client.player.vehicle.id);
};

removeMode.disableRemoveMode = (client) =>
{
	clientData.set(client, 'removeMode', null);
	util.callClientFunction(client, 'removeMode.disable');
};

removeMode.disableRemoveModeFromClientSide = (client) =>
{
	removeMode.disableRemoveMode(client);
};

removeMode.setElementById = (client, elementId) =>
{
	util.callClientFunction(client, 'removeMode.setElementById', elementId);
};

removeMode.getClientsInRemoveMode = (elementType) =>
{
	var clients = [];
	getClients().forEach(client2 =>
	{
		if(elementType == clientData.get(client2, 'removeMode'))
		{
			clients.push(client2);
		}
	});
	return clients;
};

removeMode.getElementTypeName = (elementType) =>
{
	switch(elementType)
	{
		case ELEMENT_BLIP:		return 'Blip';
		case ELEMENT_OBJECT:	return 'Object';
		case ELEMENT_PED:		return 'Ped';
		case ELEMENT_PICKUP:	return 'Pickup';
		case _ELEMENT_MARKER:	return 'Sphere';
		case ELEMENT_VEHICLE:	return 'Vehicle';
		default:				return 'Unknown Element Type';
	}
};

removeMode.getElementTypePropertyName = (elementType) =>
{
	switch(elementType)
	{
		case ELEMENT_BLIP:		return 'blips';
		case ELEMENT_OBJECT:	return 'objects';
		case ELEMENT_PED:		return 'peds';
		case ELEMENT_PICKUP:	return 'pickups';
		case _ELEMENT_MARKER:	return 'spheres';
		case ELEMENT_VEHICLE:	return 'vehicles';
		default:				return 'unknownElementType';
	}
};

removeMode.getElementIds = (elementType) =>
{
	var elementName = removeMode.getElementTypePropertyName(elementType);
	if(elements.data[elementName] === undefined)
		return [];
	return elements.data[elementName].map(v => v.id);
};

removeMode.removeElement = (client, elementType, elementId) =>
{
	if(!removeMode.isRemoveModeEnabled(client, elementType))
		return;
	
	chat.all(client.name + ' removed ' + removeMode.getElementTypeName(elementType).toLowerCase() + ' with ID ' + elementId + '.');
	
	switch(elementType)
	{
		case ELEMENT_OBJECT:
			if(!elements.isObject(elementId))
				return;
			elements.removeObject(elementId);
			break;
		case ELEMENT_VEHICLE:
			if(!elements.isVehicle(elementId))
				return;
			elements.removeVehicle(elementId);
			break;
		case ELEMENT_PICKUP:
			if(!elements.isPickup(elementId))
				return;
			elements.removePickup(elementId);
			break;
		case _ELEMENT_MARKER:
			if(!elements.isSphere(elementId))
				return;
			elements.removeSphere(elementId);
			break;
		case ELEMENT_PED:
			if(!elements.isPed(elementId))
				return;
			elements.removePed(elementId);
			break;
		case ELEMENT_BLIP:
			if(!elements.isBlip(elementId))
				return;
			elements.removeBlip(elementId);
			break;
	}
	
	removeMode.onElementRemoved(elementType);
};

removeMode.getElementsData = (elementType) =>
{
	var elementName = removeMode.getElementTypePropertyName(elementType);
	return util.objectsToArray(elements.data[elementName], removeMode.attr[elementName]);
};

removeMode.onElementRemoved = (elementType) =>
{
	util.callClientFunctionForMultiple(
		removeMode.getClientsInRemoveMode(elementType),
		'removeMode.onElementRemoved',
		removeMode.getElementsData(elementType)
	);
};

