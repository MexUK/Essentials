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
removeMode.elementsData = [];
removeMode.drawBB = true;
removeMode.localPlayerPosition = null;

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
	removeMode.drawTextRight(50, y, 'Remove ' + removeMode.getElementName(), fontSize, colour);
	
	y += 100;
	yStep = 35;
	fontSize = 18.0;
	if(removeMode.elementsData.length == 0)
		removeMode.drawTextRight(50, y, '0/0', fontSize, colour);
	else
		removeMode.drawTextRight(50, y, (removeMode.elementIndex + 1) + '/' + removeMode.elementsData.length, fontSize, colour);
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

removeMode.enable = (elementName, elementsData) =>
{
	if(removeMode.isEnabled())
		removeMode.disable();
	
	removeMode.enabled = true;
	removeMode.elementName = elementName;
	removeMode.elementsData = elementsData;
	removeMode.localPlayerPosition = localPlayer.position;
	
	if(elementsData.length == 0)
	{
		removeMode.elementIndex = -1;
		removeMode.element = null;
		return;
	}
	
	removeMode.elementIndex = 0;
	removeMode.removeConfirm = 0;
	
	removeMode.objectToCameraZRotation = localPlayer.heading - util.radians(90.0);
	removeMode.objectToCameraXYInclination = util.radians(45.0);
	
	removeMode.updateCamera();
};

removeMode.disable = () =>
{
	if(localClient.player)
		localPlayer.position = removeMode.localPlayerPosition;
	
	gta.restoreCamera(false);
	
	removeMode.enabled = false;
	removeMode.elementIndex = -1;
	removeMode.localPlayerPosition = null;
};

removeMode.isEnabled = () =>
{
	return removeMode.enabled;
};

removeMode.getElementsData = () =>
{
	return removeMode.elementsData;
};

removeMode.getElementIndexByElementId = (elementId) =>
{
	for(var i=0,j=removeMode.elementsData.length; i<j; i++)
	{
		if(elementId == removeMode.elementsData[i][0])
		{
			return i;
		}
	}
	return -1;
};

removeMode.setElementById = (elementId) =>
{
	removeMode.elementIndex = removeMode.getElementIndexByElementId(elementId);
	removeMode.updateCamera();
};

removeMode.setNextElement = () =>
{
	if(removeMode.elementIndex == (removeMode.elementsData.length - 1))
		removeMode.elementIndex = 0;
	else
		removeMode.elementIndex++;
	
	removeMode.updateCamera();
};

removeMode.setPreviousElement = () =>
{
	if(removeMode.elementIndex == 0)
		removeMode.elementIndex = removeMode.elementsData.length - 1;
	else
		removeMode.elementIndex--;
	
	removeMode.updateCamera();
};

removeMode.updateCamera = function()
{
	if(removeMode.elementIndex == -1)
		return;
	
	var elementData = removeMode.elementsData[removeMode.elementIndex];
	if(!elementData)
		return;
	
	var elementPosition = elementData[2];//.position;
	var cameraPosition = elementPosition.addSpherical(removeMode.cameraZoom, removeMode.objectToCameraXYInclination, removeMode.objectToCameraZRotation);
	
	gta.setCameraLookAt(cameraPosition, elementPosition, true);
	
	removeMode.updateLocalPlayer();
	removeMode.updateElement();
};

removeMode.updateLocalPlayer = () =>
{
	var elementData = removeMode.elementsData[removeMode.elementIndex];
	if(!elementData)
		return;
	
	var elementPosition = elementData[2];//.position;
	
	localPlayer.position = new Vec3(elementPosition.x, elementPosition.y, elementPosition.z - 35.0);
	localPlayer.health = 100.0;
};

removeMode.updateElement = () =>
{
	if(removeMode.elementIndex == -1)
		return;
	
	var elementData = removeMode.elementsData[removeMode.elementIndex];
	if(!elementData)
		return;
	
	removeMode.element = getElementFromId(elementData[0]);
	
	if(removeMode.element == null)
		return;
	
	removeMode.cameraZoom = removeMode.element.boundingRadius * 5.0;
};

removeMode.removeElement = () =>
{
	util.callServerFunction('removeMode.removeElement', removeMode.elementName, removeMode.element.id);
	
	removeMode.element = null;
};

removeMode.onElementRemoved = (elementsData) =>
{
	removeMode.elementsData = elementsData;
	
	if(elementsData.length == 0)
		removeMode.elementIndex = -1;
	else if(removeMode.elementIndex >= elementsData.length)
		removeMode.elementIndex = elementsData.length - 1;
	
	removeMode.updateCamera();
};

