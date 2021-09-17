global.removeMode = global.removeMode || {};

removeMode.enabled = false;
removeMode.object = null;
removeMode.elementName = '';
removeMode.elementIndex = -1;
removeMode.font1 = lucasFont.createDefaultFont(50.0, "Arial");
removeMode.cameraZoom = 10.0;
removeMode.objectToCameraZRotation = 0.0;
removeMode.objectToCameraXYInclination = 0.0;
removeMode.colours =
{
	bb:			0xCF0000FF,
	lines:		0xCFFF0000,
	boxes:		0xCF00FF00,
	spheres:	0xCFFFFF00,
	vertices:	0xCFFF00FF
};
removeMode.removeConfirm = 0;
removeMode.elementIds = [];
removeMode.drawBB = true;

addEventHandler('onBeforeDrawHUD', function(e)
{
	if(!removeMode.isEnabled())
		return;
	
	var colour = 0xff0398fc;
	var colourAlertable = 0xffd11111;
	var yStep;
	var fontSize;
	var y;
	
	y = 200;
	yStep = 35;
	fontSize = 25.0;
	removeMode.drawTextRight(50, y, 'Remove ' + removeMode.elementName, fontSize, colour);
	
	y += 100;
	yStep = 35;
	fontSize = 18.0;
	if(removeMode.getElementIds().length == 0)
		removeMode.drawTextRight(50, y, '0/0', fontSize, colour);
	else
		removeMode.drawTextRight(50, y, (removeMode.elementIndex + 1) + '/' + removeMode.getElementIds().length, fontSize, colour);
	y += yStep;
	if(removeMode.element != null)
		removeMode.drawTextRight(50, y, removeMode.getElementName() + ' ID: ' + removeMode.element.id, fontSize, colour);
	y += yStep;
	if(removeMode.element != null)
		removeMode.drawTextRight(50, y, 'Model ID: ' + removeMode.element.modelIndex, fontSize, colour);
	y += yStep;
	
	if(removeMode.element != null)
	{
		if(removeMode.removeConfirm)
			removeMode.drawTextRight(50, y, 'Press R again to remove, or c to cancel', fontSize, colourAlertable);
		else
			removeMode.drawTextRight(50, y, 'Press R twice to remove', fontSize, colour);
	}
	y += yStep;
	
	if(removeMode.drawBB && removeMode.element != null)
	{
		util.drawBB(removeMode.element, removeMode.colours.bb);
		util.drawColLines(removeMode.element, removeMode.colours.lines);
		util.drawColBoxes(removeMode.element, removeMode.colours.boxes);
		//util.drawColSpheres(removeMode.element, removeMode.colours.spheres);
		util.drawColTriangles(removeMode.element, removeMode.colours.vertices);
	}
	
	removeMode.updateCamera();
});

addEventHandler('onMouseMove', function(e,mouse,isAbs,diff)
{
	if(!removeMode.enabled)
		return;
	
	if(gui.cursorEnabled)
		return;
	
	removeMode.objectToCameraZRotation += util.radians(-0.1) * diff.x;
	removeMode.objectToCameraXYInclination += util.radians(-0.1) * diff.y;
	
	if(removeMode.objectToCameraXYInclination <= 0.0)
		removeMode.objectToCameraXYInclination = util.radians(0.1);
	else if(removeMode.objectToCameraXYInclination > util.radians(90.0))
		removeMode.objectToCameraXYInclination = util.radians(90.0);
	
	removeMode.updateCamera();
});

bindKey(SDLK_LEFT, KEYSTATE_DOWN, () =>
{
	if(!removeMode.enabled)
		return;
	
	removeMode.setPreviousElement();
});

bindKey(SDLK_RIGHT, KEYSTATE_DOWN, () =>
{
	if(!removeMode.enabled)
		return;
	
	removeMode.setNextElement();
});

bindKey(SDLK_r, KEYSTATE_DOWN, () =>
{
	if(!removeMode.enabled)
		return;
	
	if(removeMode.removeConfirm == 0)
	{
		removeMode.removeConfirm = 1;
		return;
	}
	
	removeMode.removeConfirm = 0;
	removeMode.removeElement();
});

bindKey(SDLK_c, KEYSTATE_DOWN, () =>
{
	if(!removeMode.enabled)
		return;
	
	if(removeMode.removeConfirm == 0)
	{
		return;
	}
	
	removeMode.removeConfirm = 0;
});

removeMode.drawTextRight = function(x, y, text, size, colour)
{
	removeMode.font1.render(text, new Vec2(gta.width - x, y), 0, 1.0, 0.0, size, colour);
};

removeMode.getElementName = () =>
{
	switch(removeMode.elementName)
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

removeMode.enable = (elementName, elementIds) =>
{
	if(removeMode.isEnabled())
		removeMode.disable();
	
	removeMode.enabled = true;
	removeMode.elementName = elementName;
	removeMode.elementIds = elementIds;
	
	if(elementIds.length == 0)
	{
		removeMode.elementIndex = -1;
		removeMode.element = null;
		return;
	}
	
	removeMode.elementIndex = 0;
	removeMode.removeConfirm = 0;
	
	removeMode.objectToCameraZRotation = localPlayer.heading - util.radians(90.0);
	removeMode.objectToCameraXYInclination = util.radians(45.0);
	
	removeMode.updateElement();
};

removeMode.disable = () =>
{
	gta.restoreCamera(false);
	
	removeMode.enabled = false;
	removeMode.elementIndex = -1;
};

removeMode.isEnabled = () =>
{
	return removeMode.enabled;
};

removeMode.getElementIds = () =>
{
	/*
	switch(removeMode.elementName)
	{
		case 'objects':		return getObjects();
		case 'vehicles':	return getVehicles();
		case 'pickups':		return getPickups();
		case 'spheres':		return getMarkers();
		case 'peds':		return getPeds();
		case 'blips':		return getBlips();
		default:			return [];
	}
	*/
	return removeMode.elementIds;
};

removeMode.setNextElement = () =>
{
	if(removeMode.elementIndex == (removeMode.getElementIds().length - 1))
		removeMode.elementIndex = 0;
	else
		removeMode.elementIndex++;
	
	removeMode.updateElement();
};

removeMode.setPreviousElement = () =>
{
	if(removeMode.elementIndex == 0)
		removeMode.elementIndex = removeMode.getElementIds().length - 1;
	else
		removeMode.elementIndex--;
	
	removeMode.updateElement();
};

removeMode.updateElement = () =>
{
	var elementId = removeMode.getElementIds()[removeMode.elementIndex];
	removeMode.element = getElementFromId(elementId);
	removeMode.cameraZoom = removeMode.element.boundingRadius * 5.0;
	
	removeMode.updateCamera();
};

removeMode.updateCamera = function()
{
	if(removeMode.element == null)
		return;
	
	var objectCentrePosition = removeMode.element.position;
	var cameraPosition = objectCentrePosition.addSpherical(removeMode.cameraZoom, removeMode.objectToCameraXYInclination, removeMode.objectToCameraZRotation);
	
	var cameraLookAtPosition = objectCentrePosition;
	gta.setCameraLookAt(cameraPosition, cameraLookAtPosition, true);
};

removeMode.removeElement = () =>
{
	util.callServerFunction('removeMode.removeElement', removeMode.elementName, removeMode.element.id);
	
	removeMode.element = null;
};

removeMode.onElementRemoved = (elementIds) =>
{
	removeMode.elementIds = elementIds;
	
	if(elementIds.length == 0)
		removeMode.elementIndex = -1;
	else if(removeMode.elementIndex >= elementIds.length)
		removeMode.elementIndex = elementIds.length - 1;
	
	removeMode.updateElement();
};

