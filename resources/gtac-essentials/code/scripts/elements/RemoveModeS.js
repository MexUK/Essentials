global.removeMode = global.removeMode || {};





removeMode.isRemoveModeEnabled = (client) =>
{
	return clientData.get(client, 'removeMode') != null;
};

removeMode.enableRemoveMode = (client, elementName) =>
{
	clientData.set(client, 'removeMode', elementName);
	util.callClientFunction(client, 'removeMode.enable', elementName);
};

removeMode.disableRemoveMode = (client) =>
{
	clientData.set(client, 'removeMode', null);
	util.callClientFunction(client, 'removeMode.disable');
};




removeMode.removeElement = (client, elementName, elementId) =>
{
	if(!removeMode.isRemoveModeEnabled(client))
		return;
	
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
	
	util.callClientFunction(client, 'removeMode.onElementRemoved');
};