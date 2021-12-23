global.removeMode = global.removeMode || {};

global._ELEMENT_MARKER = 8194;

removeMode.enabled = false;
removeMode.object = null;
removeMode.elementType = '';
removeMode.elementIndex = -1;
removeMode.font1 = lucasFont.createDefaultFont(50.0, "Arial");
removeMode.defaultCameraZoom = 10.0;
removeMode.cameraZoom = removeMode.defaultCameraZoom;
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
removeMode.exitModeConfirm = 0;

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
	removeMode.drawTextRight(50, y, 'Remove ' + removeMode.getElementTypeName(), fontSize, colour);
	
	y += 100;
	yStep = 35;
	fontSize = 18.0;
	if(removeMode.elementsData.length == 0)
		removeMode.drawTextRight(50, y, '0/0', fontSize, colour);
	else
		removeMode.drawTextRight(50, y, (removeMode.elementIndex + 1) + '/' + removeMode.elementsData.length, fontSize, colour);
	y += yStep;
	if(removeMode.element != null)
		removeMode.drawTextRight(50, y, removeMode.getElementTypeName() + ' ID: ' + removeMode.element.id, fontSize, colour);
	y += yStep;
	if(removeMode.element != null)
	{
		var modelId = removeMode.getModelId();
		removeMode.drawTextRight(50, y, 'Model ID: ' + (modelId == -1 ? 'n/a' : modelId), fontSize, colour);
	}
	y += yStep;
	
	if(removeMode.element != null)
	{
		if(removeMode.removeConfirm)
			removeMode.drawTextRight(50, y, 'Press R again to remove, or c to cancel', fontSize, colourAlertable);
		else
			removeMode.drawTextRight(50, y, 'Press R twice to remove', fontSize, colour);
	}
	y += yStep;
	
	y = gta.height - 50;
	if(removeMode.exitModeConfirm)
		removeMode.drawTextRight(50, y, 'Press Backspace again to exit remove mode, or c to cancel', fontSize, colourAlertable);
	else
		removeMode.drawTextRight(50, y, 'Press Backspace twice to exit remove mode', fontSize, colour);
	
	if(removeMode.drawBB && removeMode.element != null && removeMode.element.isType(ELEMENT_ENTITY))
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
	
	if(removeMode.removeConfirm == 1)
	{
		removeMode.removeConfirm = 0;
	}
	
	if(removeMode.exitModeConfirm == 1)
	{
		removeMode.exitModeConfirm = 0;
	}
});

bindKey(SDLK_BACKSPACE, KEYSTATE_DOWN, () =>
{
	if(!removeMode.enabled)
		return;
	
	if(removeMode.exitModeConfirm == 0)
	{
		removeMode.exitModeConfirm = 1;
		return;
	}
	
	removeMode.exitModeConfirm = 0;
	removeMode.disableFromClientSide();
});

removeMode.drawTextRight = function(x, y, text, size, colour)
{
	removeMode.font1.render(text, new Vec2(gta.width - x, y), 0, 1.0, 0.0, size, colour);
};

removeMode.getElementTypeName = () =>
{
	switch(removeMode.elementType)
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

removeMode.enable = (elementType, elementsData) =>
{
	if(removeMode.isEnabled())
		removeMode.disable();
	
	removeMode.enabled = true;
	removeMode.elementType = elementType;
	removeMode.elementsData = elementsData;
	removeMode.localPlayerPosition = localPlayer.position;
	
	if(elementsData.length == 0)
	{
		removeMode.elementIndex = -1;
		removeMode.element = null;
		return;
	}
	
	removeMode.elementIndex = removeMode.getElementIndexForNearestElement();
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

removeMode.disableFromClientSide = () =>
{
	util.callServerFunction('removeMode.disableRemoveModeFromClientSide');
};

removeMode.isEnabled = () =>
{
	return removeMode.enabled;
};

removeMode.getModelId = () =>
{
	var elementData = removeMode.getElementData();
	if(!elementData)
		return -1;
	if(elementData[1] === undefined || elementData[1] === null)
		return -1;
	return elementData[1];
};

removeMode.getElementData = () =>
{
	if(removeMode.elementIndex == -1)
		return null;
	return removeMode.elementsData[removeMode.elementIndex];
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

removeMode.getElementIndexForNearestElement = () =>
{
	var localPlayerPosition = localPlayer.position;
	var nearestElementDistance = 99999.99999;
	var nearestElementIndex = -1;
	for(var i=0,j=removeMode.elementsData.length; i<j; i++)
	{
		var elementDistance = localPlayerPosition.distance(removeMode.elementsData[i][2]);
		if(elementDistance < nearestElementDistance)
		{
			nearestElementDistance = elementDistance;
			nearestElementIndex = i;
		}
	}
	return nearestElementIndex;
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
	
	var elementData = removeMode.getElementData();
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
	var elementData = removeMode.getElementData();
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
	
	var elementData = removeMode.getElementData();
	if(!elementData)
		return;
	
	removeMode.element = getElementFromId(elementData[0]);
	
	if(removeMode.element == null)
		return;
	
	if(removeMode.element.isType(ELEMENT_ENTITY))
		removeMode.cameraZoom = removeMode.element.boundingRadius * 5.0;
	else
		removeMode.cameraZoom = removeMode.defaultCameraZoom;
};

removeMode.removeElement = () =>
{
	util.callServerFunction('removeMode.removeElement', removeMode.elementType, removeMode.element.id);
	
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

