global.mapper = {};

mapper.modes = {};
mapper.modes.CHOOSE_OBJECT = 1;
mapper.modes.PLACE_OBJECT = 2;

mapper.placeObjectModes = {};
mapper.placeObjectModes.POSITION = 1;
mapper.placeObjectModes.ROTATION = 2;
mapper.placeObjectModes.JOIN = 3;
mapper.placeObjectModes.FILL = 4;

mapper.axisModes = {}
mapper.axisModes.OBJECT = 1;
mapper.axisModes.CAMERA = 2;

mapper.modeNames = ['', 'Choose Object', 'Place Object'];
mapper.placeObjectModeNames = ['', 'Position', 'Rotation', 'Join', 'Fill'];

mapper.enabled = false;
mapper.font1 = lucasFont.createDefaultFont(50.0, "Arial");
mapper.ui = {};

mapper.mode = mapper.modes.PLACE_OBJECT;
mapper.placeObjectMode = mapper.placeObjectModes.POSITION;
mapper.axisMode = mapper.axisModes.OBJECT;
mapper.object = null;
mapper.objectToCameraZRotation = 0.0;
mapper.objectToCameraXYInclination = 0.0;
mapper.moveZRotation = 0.0;
mapper.modelId = 0;
mapper.objectPosition = null;

mapper.defaultModelId = 709;
mapper.minCameraZoom = 2.0;
mapper.maxCameraZoom = 2500.0;

//mapper.nextJoinObjectAt = 0;
mapper.joinObjectInterval = 0.25;

mapper.processAlpha1 = 0.0;

mapper.objectIdRange = {
	min: 258,
	max: 5000
};

mapper.objects = [];

mapper.spinObject = false;
mapper.spinObjectSpeed = new Vec3(0.0, 0.0, 1.0);
mapper.bbMultiplier = new Vec3(1.0, 1.0, 1.0);
mapper.joinOnRotate = true;
mapper.autoZoom = true;
mapper.cameraZoom = mapper.minCameraZoom;
mapper.objectStepUsingBB = true;
mapper.objectPositionStep = new Vec3(1.0, 0.0, 0.0);
mapper.objectRotationStep = new Vec3(0.0, 0.0, 0.0);
mapper.maxObjectOffsetLength = 50.0;

/*
mapper.joinObjectOptions = [
	[0, 1, 0],
	[0, 1, 1],
	[0, 1, 2],
	
	[0, 2, 0],
	[0, 2, 1],
	[0, 2, 2],
	
	[1, 0, 0],
	[1, 0, 1],
	[1, 0, 2],
	
	[2, 0, 0],
	[2, 0, 1],
	[2, 0, 2]
];
*/
mapper.joinObjectOptions = [
	[1, 0, 0],
	[0, 2, 0],
	[2, 0, 0],
	[0, 1, 0]
];
mapper.joinIndex = 0;
mapper.joinCount = mapper.joinObjectOptions.length;

mapper.colours =
{
	bb:			0xCF0000FF,
	lines:		0xCFFF0000,
	boxes:		0xCF00FF00,
	spheres:	0xCFFFFF00,
	vertices:	0xCFFF00FF
};

// window
mapper.init = function()
{
};

mapper.updateTextInput = function(name, value)
{
	if(mexui.focusedControl == mapper.ui[name])
		return;
	
	mapper.ui[name].setText(value + "");
};

mapper.updateVec3TextInputs = function(name, vec)
{
	mapper.updateTextInput(name+'X', vec.x);
	mapper.updateTextInput(name+'Y', vec.y);
	mapper.updateTextInput(name+'Z', vec.z);
};

mapper.updateUI = function()
{
};

mapper.init();

// events
var b = true;
addEventHandler('onProcess', function(e,delta)
{
	if(!mapper.enabled)
		return;
	
	mapper.processAlpha1 += delta;
	
	localPlayer.health = 100.0;
	if(localPlayer.vehicle)
		localPlayer.vehicle.health = 1000.0;
	
	//if(mapper.object.position.z < -50.0)
	//	mapper.snapToGround();

	if(mapper.mode == mapper.modes.PLACE_OBJECT)
	{
		if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION)
		{
			mapper.moveObjectXY();
			mapper.moveObjectZ();
		}
		else if(mapper.placeObjectMode == mapper.placeObjectModes.ROTATION)
		{
			mapper.rotateObjectXY();
			mapper.rotateObjectZ();
		}
		else if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN)
		{
			//mapper.checkToJoinObject();
		}
		else if(mapper.placeObjectMode == mapper.placeObjectModes.FILL)
		{
			mapper.moveObjectXY();
			mapper.moveObjectZ();
			//mapper.checkToFillObjects();
		}
	}
	
	mapper.checkToZoomCamera();
	
	if(mapper.spinObject)
		mapper.processObjectSpin(delta);
	
	mapper.updatePlayer();
	mapper.updateUI();
	
	//console.log(mapper.object.boundingMax.x - mapper.object.boundingMin.x);
});

mapper.getPlaceModeName = () =>
{
	if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION)
		return 'Position';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.ROTATION)
		return 'Rotation';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN)
		return 'Join';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.FILL)
		return 'Fill';
	else
		return 'Unknown Mode';
};

mapper.getPlaceModeKeys = () =>
{
	if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION)
		return 'LRUD Ctrl+UD Shift+LRUD Ctrl+Shift+UD';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.ROTATION)
		return 'LRUD Ctrl+LRUD Shift+LRUD Ctrl+Shift+LRUD';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN)
		return 'LR';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.FILL)
		return '';
	else
		return '';
};

addEventHandler('onBeforeDrawHUD', function(e)
{
	if(!mapper.enabled)
		return;
	
	if(!mapper.object)
		return;
	
	var placeModeName = mapper.getPlaceModeName();
	var globalKeys = '1 2 3 + - G X # Enter PageUD';
	var modeKeys = mapper.getPlaceModeKeys();
	var placeModeOption;
	
	if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION)
		placeModeOption = mapper.axisMode == mapper.axisModes.OBJECT ? 'Object Axis' : 'Camera Axis';
	else if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN)
		placeModeOption = 'Option ' + (mapper.joinIndex + 1) + '/' + mapper.joinCount;
	
	var colour = 0xff0398fc;
	var colourUnusable = 0xffd11111;
	var yStep;
	var fontSize;
	var y;
	
	y = 200;
	yStep = 35;
	fontSize = 25.0;
	mapper.drawTextRight(50, y, 'Mapper', fontSize, colour);
	
	y += 100;
	yStep = 35;
	fontSize = 18.0;
	mapper.drawTextRight(50, y, mapper.object.modelIndex+'', fontSize, colour);
	y += yStep;
	mapper.drawTextRight(50, y, placeModeName, fontSize, colour);
	y += yStep;
	if(placeModeOption)
		mapper.drawTextRight(50, y, placeModeOption, fontSize, colour);
	y += yStep;
	
	// keys
	y += 100;
	yStep = 35;
	fontSize = 18.0;
	mapper.drawTextRight(50, y, globalKeys, fontSize, colour);
	y += yStep;
	mapper.drawTextRight(50, y, modeKeys, fontSize, mapper.placeObjectMode == mapper.placeObjectModes.JOIN && mapper.objects.length == 0 ? colourUnusable : colour);
	y += yStep;
	
	util.drawBB(mapper.object, mapper.colours.bb);
	util.drawColLines(mapper.object, mapper.colours.lines);
	util.drawColBoxes(mapper.object, mapper.colours.boxes);
	//util.drawColSpheres(mapper.object, mapper.colours.spheres);
	util.drawColTriangles(mapper.object, mapper.colours.vertices);
});

addEventHandler('onMouseMove', function(e,mouse,isAbs,diff)
{
	if(!mapper.enabled)
		return;
	
	if(gui.cursorEnabled)
		return;
	
	mapper.objectToCameraZRotation += util.radians(-0.1) * diff.x;
	mapper.objectToCameraXYInclination += util.radians(-0.1) * diff.y;
	
	if(mapper.objectToCameraXYInclination <= 0.0)
		mapper.objectToCameraXYInclination = util.radians(0.1);
	else if(mapper.objectToCameraXYInclination > util.radians(90.0))
		mapper.objectToCameraXYInclination = util.radians(90.0);
	
	mapper.updateCamera();
});

addEventHandler('onMouseWheel', function(e,mouse,coords,flipped)
{
	if(!mapper.enabled)
		return;
	
	var increaseBy = coords.y > 0.0 ? 1 : -1;
	mapper.changeObjectModel(increaseBy);
});

bindKey(SDLK_x, KEYSTATE_DOWN, () =>
{
	if(!mapper.enabled)
		return;
	
	mapper.axisMode = mapper.axisMode == mapper.axisModes.OBJECT ? mapper.axisModes.CAMERA : mapper.axisModes.OBJECT;
});

bindKey(SDLK_HASH, KEYSTATE_DOWN, () =>
{
	if(!mapper.enabled)
		return;
	
	mapper.toggleObjectSpin();
});

var returnKeyCB = () =>
{
	if(!mapper.enabled)
		return;
	
	//if(gui.cursorEnabled)
	//	return;
	
	if(mapper.mode == mapper.modes.CHOOSE_OBJECT)
	{
		mapper.chooseObject();
	}
	else if(mapper.mode == mapper.modes.PLACE_OBJECT)
	{
		if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION
		|| mapper.placeObjectMode == mapper.placeObjectModes.ROTATION
		|| mapper.placeObjectMode == mapper.placeObjectModes.JOIN
		|| mapper.placeObjectMode == mapper.placeObjectModes.FILL)
		{
			mapper.placeObject();
			
			if(mapper.placeObjectMode == mapper.placeObjectModes.FILL)
			{
				mapper.fillObjects();
			}
		}
	}
};
bindKey(SDLK_RETURN, KEYSTATE_DOWN, returnKeyCB);
bindKey(SDLK_RETURN2, KEYSTATE_DOWN, returnKeyCB);
bindKey(SDLK_KP_ENTER, KEYSTATE_DOWN, returnKeyCB);

bindKey(SDLK_BACKSPACE, KEYSTATE_DOWN, () =>
{
	if(!mapper.enabled)
		return;
	
	/*
	if(mapper.mode != mapper.modes.CHOOSE_OBJECT)
	{
		mapper.mode = mapper.modes.CHOOSE_OBJECT;
		mapper.updateUI()
	}
	*/
});

bindKey(SDLK_SPACE, KEYSTATE_DOWN, () =>
{
	if(!mapper.enabled)
		return;
	
	/*
	if(mapper.mode == mapper.modes.PLACE_OBJECT)
	{
		if(mapper.placeObjectMode == mapper.placeObjectModes.FILL)
		{
			mapper.placeFillObject();
		}
	}
	*/
});

var increaseModelIdCB = () =>
{
	if(!mapper.enabled)
		return;
	
	mapper.changeObjectModel(1);
};
bindKey(SDLK_PLUS, KEYSTATE_DOWN, increaseModelIdCB);
bindKey(SDLK_KP_PLUS, KEYSTATE_DOWN, increaseModelIdCB);

var decreaseModelIdCB = () =>
{
	if(!mapper.enabled)
		return;
	
	mapper.changeObjectModel(-1);
};
bindKey(SDLK_MINUS, KEYSTATE_DOWN, decreaseModelIdCB);
bindKey(SDLK_KP_MINUS, KEYSTATE_DOWN, decreaseModelIdCB);

mapper.checkToSetPlaceObjectMode = function(placeObjectMode)
{
	if(!mapper.enabled)
		return;
	
	mapper.placeObjectMode = placeObjectMode;
};

bindKey(SDLK_p, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.POSITION));
bindKey(SDLK_r, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.ROTATION));
bindKey(SDLK_j, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.JOIN));
//bindKey(SDLK_f, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.FILL));

bindKey(SDLK_1, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.POSITION));
bindKey(SDLK_2, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.ROTATION));
bindKey(SDLK_3, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.JOIN));
//bindKey(SDLK_4, KEYSTATE_DOWN, () => mapper.checkToSetPlaceObjectMode(mapper.placeObjectModes.FILL));

bindKey(SDLK_LEFT, KEYSTATE_DOWN, () => mapper.checkToSetJoinIndex(true));
bindKey(SDLK_RIGHT, KEYSTATE_DOWN, () => mapper.checkToSetJoinIndex(false));

mapper.checkToSetJoinIndex = (state) =>
{
	if(!mapper.enabled)
		return;
	
	if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN && mapper.canChangeJoinIndex())
		mapper.changeJoinIndex(state);
};

/*
mapper.resetProcessAlpha = function()
{
	mapper.processAlpha1 = 500.0;
};
bindKey(SDLK_LEFT, KEYSTATE_UP, () => resetProcessAlpha);
bindKey(SDLK_RIGHT, KEYSTATE_UP, () => resetProcessAlpha);
bindKey(SDLK_UP, KEYSTATE_UP, () => resetProcessAlpha);
bindKey(SDLK_DOWN, KEYSTATE_UP, () => resetProcessAlpha);
*/

bindKey(SDLK_g, KEYSTATE_DOWN, () =>
{
	if(!mapper.enabled)
		return;
	
	mapper.snapToGround();
});

// toggle map editor
mapper.setEnabled = function(modelId)
{
	mapper.enabled = true;
	
	gui.showCursor(false, false);
	
	mapper.startChoosingObject(modelId);
};

mapper.setDisabled = function()
{
	mapper.enabled = false;
	
	gui.showCursor(false, false);
	
	mapper.closeMapper();
};

mapper.toggleEnabled = function()
{
};

// close mapper
mapper.closeMapper = function()
{
	var pos = mapper.object.position;
	
	mapper.enabled = false;
	
	destroyElement(mapper.object);
	mapper.object = null;
	
	mapper.objects.map(v => destroyElement(v));
	mapper.objects = [];
	
	gta.restoreCamera(false);
	
	pos.z = util.getGroundZ(pos.x, pos.y);
	localPlayer.position = pos;
};

// choose object
mapper.startChoosingObject = function(modelId)
{
	mapper.mode = mapper.modes.PLACE_OBJECT;
	mapper.placeObjectMode = mapper.placeObjectModes.POSITION;
	mapper.axisMode = mapper.axisModes.OBJECT;
	mapper.modelId = modelId;
	mapper.objectToCameraZRotation = 0.0;
	mapper.objectToCameraXYInclination = 0.0;
	mapper.moveZRotation = 0.0;
	
	mapper.object = mapper.createObject(modelId, localPlayer.position);
	
	var cameraToObjectDistance2D = mapper.object.boundingRadius * 1.35;
	var objectPosition = localPlayer.position.addPolar(cameraToObjectDistance2D, mapper.objectToCameraZRotation - util.radians(180.0));
	mapper.object.position = objectPosition;
	mapper.objectPosition = objectPosition;
	
	mapper.object.collisionsEnabled = true;
	
	if(mapper.autoZoom)
	{
		mapper.setCameraZoom(mapper.object.boundingRadius * 3.0);
	}
	mapper.objectToCameraZRotation = localPlayer.heading - util.radians(90.0);
	mapper.objectToCameraXYInclination = util.radians(45.0);
	mapper.updateCamera();
	
	mapper.updateUI();
};

mapper.chooseObject = function()
{
	mapper.startPlacingObject();
	
	mapper.updateUI()
};

// next object
mapper.addNextObject = function()
{
	var newObjectRotation = mapper.object.getRotation();
	
	//var newObjectPosition = mapper.object.position.addPolar(1.0, mapper.objectToCameraZRotation + util.radians(180.0));
	//var bbw = mapper.object.boundingMax.x - mapper.object.boundingMin.x;
	//var bbd = mapper.object.boundingMax.y - mapper.object.boundingMin.y;
	var bb = util.getColSize();
	var bbw = bb.x;
	var bbd = bb.y;
	var usew = true;
	var bbl = usew ? bbw : bbd;
	var newObjectPosition = mapper.object.position.addPolar(bbl, mapper.object.heading + util.radians(90.0));
	//var pos = mapper.object.position;
	//var newObjectPosition = new Vec3(pos.x + bb.x, pos.y, pos.z);
	
	mapper.object = mapper.createObject(mapper.object.modelIndex, newObjectPosition);
	mapper.object.setRotation(newObjectRotation);
	mapper.updateCamera();
	mapper.updatePlayer();
};

mapper.getSecondObjectPositionOffset = (usew) =>
{
	var object = mapper.objects[mapper.objects.length - 1];
	var bb = util.getColSize(object);
	var bbw = bb.x;
	var bbd = bb.y;
	usew = usew || true;
	var bbl = usew ? bbw : bbd;
	return (new Vec3(0.0, 0.0, 0.0)).addPolar(bbl, object.heading + util.radians(90.0));
};

mapper.getObjectPositionOffset = (usew) =>
{
	var object1 = mapper.objects[mapper.objects.length - 2];
	var object2 = mapper.objects[mapper.objects.length - 1];
	
	var position1 = object1.position;
	var position2 = object2.position;
	
	var offset = new Vec3(position2.x - position1.x, position2.y - position1.y, position2.z - position1.z);
	
	if(offset.length > mapper.maxObjectOffsetLength)
	{
		offset = mapper.getSecondObjectPositionOffset(usew);
	}
	
	return offset;
};

// create object
mapper.createObject = function(model, pos)
{
	//var ob = gta.createObject(model, pos);
	var ob = gta.createBuilding(model, pos);
	//ob.objectType = 2;
	return ob;
};

// object id
mapper.getRandomObjectId = function()
{
	return util.rand(mapper.objectIdRange.min, mapper.objectIdRange.max);
};

// place object
mapper.startPlacingObject = function()
{
	mapper.mode = mapper.modes.PLACE_OBJECT;
};

mapper.placeObject = function()
{
	//if(mapper.isObjectAtPosRot(mapper.object.position, mapper.object.getRotation())
	//	return;
	
	mapper.storeActiveObject();
	
	var offset;
	if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION
	|| mapper.placeObjectMode == mapper.placeObjectModes.ROTATION)
	{
		if(mapper.objects.length == 1)
		{
			offset = mapper.getSecondObjectPositionOffset();
		}
		else
		{
			offset = mapper.getObjectPositionOffset();
		}
	}
	
	mapper.addNextObject();
	
	if(mapper.placeObjectMode == mapper.placeObjectModes.POSITION
	|| mapper.placeObjectMode == mapper.placeObjectModes.ROTATION)
	{
		mapper.setObjectPositionRotationByPositionOffset(offset);
	}
	else if(mapper.placeObjectMode == mapper.placeObjectModes.JOIN)	
	{
		mapper.setObjectPositionRotationByJoinIndex(mapper.joinIndex);
	}
};

mapper.storeActiveObject = function()
{
	mapper.objects.push(mapper.object);
	util.callServerFunction('mapper.storeActiveObject', mapper.object.id, mapper.object.modelIndex, mapper.object.position, mapper.object.getRotation());
};

// place fill object
mapper.placeFillObject = function()
{
	//mapper.addNextObject();
};

// object model
mapper.setNextObjectModel = function(modelId, increaseBy)
{
	for(;;)
	{
		if(modelId < mapper.objectIdRange.min)
			modelId = mapper.objectIdRange.max;
		else if(modelId > mapper.objectIdRange.max)
			modelId = mapper.objectIdRange.min;
		
		try
		{
			mapper.setObjectModel(modelId);
			mapper.updateUI();
			return;
		}
		catch(e)
		{
			if(increaseBy >= 0.0)
				modelId++;
			else
				modelId--;
		}
	}
};

mapper.changeObjectModel = function(increaseBy)
{
	if(isKeyDown(SDLK_LCTRL) || isKeyDown(SDLK_RCTRL))
		increaseBy = increaseBy >= 0.0 ? 50.0 : -50.0;
	
	mapper.setNextObjectModel(mapper.modelId + increaseBy, increaseBy);
};

mapper.setObjectModel = function(modelId)
{
	mapper.modelId = modelId;
	mapper.object.modelIndex = modelId;
	
	//mapper.joinCount = 12;//mapper.object.collisionVertices.length / 3;
	
	
	//requestModel(7885 + modelId, 8);
	
	//gta.LOAD_ALL_MODELS_NOW();
	
	//var t = setInterval(()=>{
	//	if(gta.HAS_MODEL_LOADED(7885 + modelId)) {
	//		clearInterval(t);
	//		console.log('js says col has loaded: '+modelId);
	//		keepModelLoaded(7885 + modelId);
	//	}
	//}, 100);
	
	
	
	if(mapper.autoZoom)
	{
		mapper.setCameraZoom(mapper.object.boundingRadius * 3.0);
	}
	
	mapper.updateCamera();
	mapper.updatePlayer();
};

// camera zoom
mapper.setCameraZoom = (zoom) =>
{
	if(zoom < mapper.minCameraZoom)
	{
		zoom = mapper.minCameraZoom;
	}
	else if(zoom > mapper.maxCameraZoom)
	{
		zoom = mapper.maxCameraZoom;
	}
	mapper.cameraZoom = zoom;
	mapper.updateCamera();
};

// move object
mapper.getKeysHeading = (left, right, up, down) =>
{
	if(up)
	{
		if(left)
			return -135.0;
		else if(right)
			return 135.0;
		else
			return 180.0;
	}
	else if(down)
	{
		if(left)
			return -45.0;
		else if(right)
			return 45.0;
		else
			return 0.0;
	}
	else
	{
		if(left)
			return -90.0;
		else if(right)
			return 90.0;
	}
	return 0.0;
};

mapper.moveObjectXY = function()
{
	var lcontrol = isKeyDown(SDLK_LCTRL);
	var rcontrol = isKeyDown(SDLK_RCTRL);
	var control = lcontrol || rcontrol;
	
	if(control)
		return;
	
	var up = isKeyDown(SDLK_UP) || isKeyDown(SDLK_w);
	var down = isKeyDown(SDLK_DOWN) || isKeyDown(SDLK_s);
	var left = isKeyDown(SDLK_LEFT) || isKeyDown(SDLK_a);
	var right = isKeyDown(SDLK_RIGHT) || isKeyDown(SDLK_d);
	
	if(!(left || right || up || down))
		return;
	
	var lshift = isKeyDown(SDLK_LSHIFT);
	var rshift = isKeyDown(SDLK_RSHIFT);
	var shift = lshift || rshift;
	
	var keysHeadingDeg = mapper.getKeysHeading(left, right, up, down);
	
	var radius;
	if(shift)
		radius = 0.01;
	else
		radius = 1.0;
	
	var heading;
	if(mapper.axisMode == mapper.axisModes.OBJECT)
	{
		var halfPI = Math.PI / 2.0;
		var cameraHeadingRad = ((Math.floor((mapper.objectToCameraZRotation + (Math.PI / 4.0)) / halfPI) % 4) + 1) * halfPI;
		heading = (cameraHeadingRad + util.radians(keysHeadingDeg)) - (Math.PI / 2.0);
	}
	else if(mapper.axisMode == mapper.axisModes.CAMERA)
		heading = mapper.objectToCameraZRotation + util.radians(keysHeadingDeg);
	
	var position = mapper.object.position.addPolar(radius, heading);
	mapper.setObjectPosition(position);
};

mapper.moveObjectZ = function()
{
	var lcontrol = isKeyDown(SDLK_LCTRL);
	var rcontrol = isKeyDown(SDLK_RCTRL);
	var control = lcontrol || rcontrol;
	
	if(!control)
		return;
	
	var up = isKeyDown(SDLK_UP) || isKeyDown(SDLK_w);
	var down = isKeyDown(SDLK_DOWN) || isKeyDown(SDLK_s);
	if(!up && !down)
		return;
	
	var lshift = isKeyDown(SDLK_LSHIFT);
	var rshift = isKeyDown(SDLK_RSHIFT);
	var shift = lshift || rshift;
	
	var zdiff;
	if(shift)
		zdiff = 0.01;
	else
		zdiff = 0.3;
	
	zdiff *= up ? 1.0 : -1.0;
	
	var pos = mapper.object.position;
	pos.z += zdiff;
	mapper.setObjectPosition(pos);
};

// rotate object
mapper.rotateObjectXY = function()
{
	var lcontrol = isKeyDown(SDLK_LCTRL);
	var rcontrol = isKeyDown(SDLK_RCTRL);
	var control = lcontrol || rcontrol;
	
	var left = isKeyDown(SDLK_LEFT) || isKeyDown(SDLK_a);
	var right = isKeyDown(SDLK_RIGHT) || isKeyDown(SDLK_d);
	var up = isKeyDown(SDLK_UP) || isKeyDown(SDLK_w);
	var down = isKeyDown(SDLK_DOWN) || isKeyDown(SDLK_s);
	
	if(!left && !right && !up && !down)
		return;
	
	if((left || right) && !control)
		return;
	
	var lshift = isKeyDown(SDLK_LSHIFT);
	var rshift = isKeyDown(SDLK_RSHIFT);
	var shift = lshift || rshift;
	
	var radius;
	if(shift)
		radius = util.radians(0.01);
	else
		radius = util.radians(1.0);
	
	var rot = mapper.object.getRotation();
	var bb = util.getColSize();
	var index = up ? 0 : (down ? 1 : (left ? 2 : (right ? 3 : 4)));
	var anglesDeg = [180.0, 0.0, 270.0, 90.0];
	var camToObZRot = mapper.objectToCameraZRotation + util.radians(anglesDeg[index]);
	var zrotdeg = util.degrees(rot.z - camToObZRot) % 360.0;
	while(zrotdeg < 0.0)
		zrotdeg += 360.0;
	var front2 = zrotdeg >= 315.0 || zrotdeg < 45.0;
	var back2 = zrotdeg >= 135.0 && zrotdeg < 225.0;
	var left2 = zrotdeg >= 45.0 && zrotdeg < 135.0;
	var right2 = zrotdeg >= 225.0 && zrotdeg < 315.0;
	//console.log('zrotdeg='+zrotdeg+', front='+front2+', back='+back2+', left='+left2+', right='+right2);
	
	var offset = new Vec3(0.0, 0.0, 0.0);
	var axis = (front2 || back2) ? 1 : 0;
	if(back2 || right2)
		radius = -radius;
	rot[axis] += radius;
	
	mapper.object.setRotation(rot);
	
	if(false && mapper.joinOnRotate)
	{
		mapper.joinToLastObject();
	}
};

mapper.rotateObjectZ = function()
{
	var lcontrol = isKeyDown(SDLK_LCTRL);
	var rcontrol = isKeyDown(SDLK_RCTRL);
	var control = lcontrol || rcontrol;
	
	var left = isKeyDown(SDLK_LEFT) || isKeyDown(SDLK_a);
	var right = isKeyDown(SDLK_RIGHT) || isKeyDown(SDLK_d);
	if(!left && !right)
		return;
	
	var lshift = isKeyDown(SDLK_LSHIFT);
	var rshift = isKeyDown(SDLK_RSHIFT);
	var shift = lshift || rshift;
	
	var zdiff;
	if(shift)
		zdiff = util.radians(0.01);
	else
		zdiff = util.radians(0.3);
	
	zdiff *= right ? 1.0 : -1.0;
	
	var rot = mapper.object.getRotation();
	rot.z += zdiff;
	mapper.object.setRotation(rot);
};

// join object
mapper.checkToJoinObject = function()
{
	if(mapper.processAlpha1 >= mapper.joinObjectInterval)
	{
		mapper.processAlpha1 = 0.0;
	}
};

mapper.canChangeJoinIndex = (left) => mapper.objects.length > 0;

mapper.changeJoinIndex = (left) =>
{
	var step = left ? -1 : 1;
	mapper.joinIndex += step;
	
	if(mapper.joinIndex >= mapper.joinCount)
		mapper.joinIndex = 0;
	else if(mapper.joinIndex < 0)
		mapper.joinIndex = mapper.joinCount - 1;
	
	mapper.joinObject();
};

mapper.joinObject = function()
{
	if(!mapper.canChangeJoinIndex())
		return;
	
	mapper.setObjectPositionRotationByJoinIndex(mapper.joinIndex);
	
	//var anglesDeg = [180.0, 0.0, 270.0, 90.0];
	//mapper.addJoinedObject(util.radians(anglesDeg[index]));
	
	//mapper.storeActiveObject();
};

// fill objects
/*
mapper.checkToFillObjects = function()
{
	if(mapper.processAlpha1 >= mapper.joinObjectInterval)
	{
		mapper.processAlpha1 = 0.0;
		
		mapper.fillObjects();
		//mapper.nextJoinObjectAt = now + mapper.joinObjectInterval;
	}
};
*/

mapper.fillObjects = function()
{
	if(mapper.objects.length < 2)
		return;
	
	var object1 = mapper.objects[mapper.objects.length - 2];
	var object2 = mapper.objects[mapper.objects.length - 1];
	
	var data = mapper.getFilledObjectsData(object1, object2);
	for(var i=0,j=data[0].length; i<j; i++)
	{
		var ob = mapper.createObject(mapper.object.modelIndex, data[0][i]);
		ob.setRotation(data[1][i]);
		mapper.objects.push(ob);
	}
};

mapper.getFilledObjectsData = function(object1, object2)
{
	var data = [[],[]];
	
	var pos1 = object1.position;
	var pos2 = object2.position;
	var posDiff = new Vec3(pos2.x-pos1.x, pos2.y-pos1.y, pos2.z-pos1.z);
	
	var rot1 = object1.getRotation();
	var rot2 = object2.getRotation();
	
	var bb = util.getColSize();
	var steps = posDiff.length / bb.length;
	
	steps = Math.ceil(steps);
	
	var posStep = new Vec3(posDiff.x/steps, posDiff.y/steps, posDiff.z/steps);
	var rotStep = new Vec3((rot2.x-rot1.x)/steps, (rot2.y-rot1.y)/steps, (rot2.z-rot1.z)/steps);
	
	for(var i=0; i<steps; i++)
	{
		var pos = new Vec3(pos1.x + posStep.x*i, pos1.y + posStep.y*i, pos1.z + posStep.z*i);
		var rot = new Vec3(rot1.x + rotStep.x*i, rot1.y + rotStep.y*i, rot1.z + rotStep.z*i);
		
		data[0][i] = pos;
		data[1][i] = rot;
	}
	
	return data;
};

// object position
mapper.setObjectPosition = function(position)
{
	mapper.object.position = position;
	mapper.objectPosition = position;
	mapper.updateCamera();
	mapper.updatePlayer();
};

mapper.getObjectCentrePosition = function()
{
	var pos = mapper.object.position;
	pos.x += mapper.object.boundingCentre.x;
	pos.y += mapper.object.boundingCentre.y;
	pos.z += mapper.object.boundingCentre.z;
	return pos;
};

// object joining
mapper.getJoinedObjectPosition = function(position, rotation, axis)
{
	var [min, max] = util.getColMinMax(mapper.object);
	var bb = new Vec3(max.x - min.x, max.y - min.y, max.z - min.z);
	
	//rotation.z += (Math.PI/2.0) * axis;
	
	var point2 = new Vec3(0.0, 0.0, 0.0);
	switch(axis)
	{
		case 0:
			point2[0] = bb[0];
			break;
		case 1:
			point2[1] = -bb[1];
			break;
		case 2:
			point2[0] = -bb[0];
			break;
		case 3:
			point2[1] = bb[1];
			break;
	}
	bb = util.getRotatedPoint2(rotation, point2);
	
	var point = new Vec3();
	for(var i2=0; i2<3; i2++)
	{
		/*if(i2 == 2)
			point[i2] = position[i2];
		else*/
			point[i2] = position[i2] + bb[i2];
		/*
		switch(axis[i2])
		{
			case 0:
				point[i2] = position[i2];
			break;
			case 1:
				point[i2] = position[i2] + bb[i2];
			break;
			case 2:
				point[i2] = position[i2] - bb[i2];
			break;
		}
		*/
	}
	
	return point;
};

mapper.setObjectPositionRotationByPositionOffset = function(offset)
{
	var object = mapper.objects[mapper.objects.length - 1];
	var position = object.position;
	var newObjectPosition = new Vec3(position.x + offset.x, position.y + offset.y, position.z + offset.z);
	var newObjectRotation = object.getRotation();
	
	mapper.object.position = newObjectPosition;
	mapper.object.setRotation(newObjectRotation);
	
	mapper.updateCamera();
	mapper.updatePlayer();
};

mapper.setObjectPositionRotationByJoinIndex = function(joinIndex)
{
	if(mapper.objects.length == 0)
		return;
	
	var lastObject = mapper.objects[mapper.objects.length - 1];
	//var axis = mapper.joinObjectOptions[joinIndex];
	
	var newObjectPosition = mapper.getJoinedObjectPosition(lastObject.position, lastObject.getRotation(), joinIndex);
	var newObjectRotation = mapper.object.getRotation();
	
	mapper.object.position = newObjectPosition;
	mapper.object.setRotation(newObjectRotation);
	
	mapper.updateCamera();
	mapper.updatePlayer();
	
	if(true)
		return;
	
	
	
	
	
	
	/*
	var points = [
		mapper.object.collisionVertices[joinIndex],
		mapper.object.collisionVertices[joinIndex + 1],
		mapper.object.collisionVertices[joinIndex + 2]
	];
	
	var bb = a;
	*/
	
	
	
	
	
	
	
	
	var pos = mapper.object.position;
	var rot = mapper.object.getRotation();
	
	rot.x += mapper.objectRotationStep.x;
	rot.y += mapper.objectRotationStep.y;
	rot.z += mapper.objectRotationStep.z;
	
	var bb = util.getColSize();
	var anglesDeg = [180.0, 0.0, 270.0, 90.0];
	var camToObZRot = mapper.objectToCameraZRotation + util.radians(anglesDeg[joinIndex]);
	var zrotdeg = util.degrees(rot.z - camToObZRot) % 360.0;
	while(zrotdeg < 0.0)
		zrotdeg += 360.0;
	var front = zrotdeg >= 315.0 || zrotdeg < 45.0;
	var back = zrotdeg >= 135.0 && zrotdeg < 225.0;
	var left = zrotdeg >= 45.0 && zrotdeg < 135.0;
	var right = zrotdeg >= 225.0 && zrotdeg < 315.0;
	//console.log('zrotdeg='+zrotdeg+', front='+front+', back='+back+', left='+left+', right='+right);
	
	var lastObject = mapper.objects[mapper.objects.length - 1];
	var lastPos = lastObject.position;
	var lastRot = lastObject.getRotation();
	
	var halfbb = new Vec3(bb.x/2.0, bb.y/2.0, bb.z/2.0);
	
	var m = new Matrix4x4;
	m.setIdentity();
	m.setRotate(rot);
	
	var offset = new Vec3(0.0, 0.0, 0.0);
	var axis = (front || back) ? 0 : 1;
	offset[axis] = (back || left) ? -halfbb[axis] : halfbb[axis];
	
	var pos2 = translate(m, offset);
	m.setRotate(lastRot);
	
	var vec = translate(m, offset);
	pos2.x += lastPos.x + vec.x;
	pos2.y += lastPos.y + vec.y;
	pos2.z += lastPos.z + vec.z;
	
	pos = pos2;
	
	mapper.object.position = pos;
	mapper.object.setRotation(rot);
	
	mapper.updateCamera();
	mapper.updatePlayer();
};

mapper.joinToLastObject = function()
{
	if(mapper.objects.length < 1)
		return;
	
	var index = 0;
	var lastObject = mapper.objects[mapper.objects.length - 1];
	
	var lastRot = lastObject.getRotation();
	var newObjectRotation = mapper.object.getRotation();
	
	var bb = util.getColSize();
	var halfbb = new Vec3(bb.x/2.0, bb.y/2.0, bb.z/2.0);
	var anglesDeg = [180.0, 0.0, 270.0, 90.0];
	var camToObZRot = mapper.objectToCameraZRotation + util.radians(anglesDeg[index]);
	var zrotdeg = util.degrees(newObjectRotation.z - camToObZRot) % 360.0;
	while(zrotdeg < 0.0)
		zrotdeg += 360.0;
	var front = zrotdeg >= 315.0 || zrotdeg < 45.0;
	var back = zrotdeg >= 135.0 && zrotdeg < 225.0;
	var left = zrotdeg >= 45.0 && zrotdeg < 135.0;
	var right = zrotdeg >= 225.0 && zrotdeg < 315.0;
	
	var m = new Matrix4x4;
	m.setIdentity();
	m.setRotate(newObjectRotation);
	//m.setTranslate(new Vec3(bb.x/2.0, bb.y/2.0, bb.z/2.0));
	//m.setTranslate(bb);
	//m.setRotate(newObjectRotation);
	//m.setTranslate(bb);
	
	var offset = new Vec3(0.0, 0.0, 0.0);
	var axis = (front || back) ? 0 : 1;
	offset[axis] = (back || left) ? -halfbb[axis] : halfbb[axis];
	var newObjectPosition = translate(m, offset);
	m.setRotate(lastRot);
	var vec = translate(m, offset);
	newObjectPosition.x += lastObject.position.x + vec.x;
	newObjectPosition.y += lastObject.position.y + vec.y;
	newObjectPosition.z += lastObject.position.z + vec.z;
	
	mapper.object.position = newObjectPosition;
	mapper.updateCamera();
	mapper.updatePlayer();
};

// object spin
mapper.processObjectSpin = function(delta)
{
	var rot = mapper.object.getRotation();
	
	rot.x += delta * mapper.spinObjectSpeed.x;
	rot.y += delta * mapper.spinObjectSpeed.y;
	rot.z += delta * mapper.spinObjectSpeed.z;
	
	mapper.object.setRotation(rot);
};

mapper.toggleObjectSpin = function()
{
	mapper.spinObject = !mapper.spinObject;
};

mapper.toggleJoinOnRotate = function()
{
	mapper.joinOnRotate = !mapper.joinOnRotate;
};

mapper.toggleAutoZoom = function()
{
	mapper.autoZoom = !mapper.autoZoom;
	
	if(mapper.autoZoom)
	{
		mapper.setCameraZoom(mapper.object.boundingRadius * 3.0);
	}
	
	mapper.updateCamera();
};

mapper.toggleObjectStepUsingBB = function()
{
	mapper.objectStepUsingBB = !mapper.objectStepUsingBB;
};

mapper.applyModel = function()
{
	var model = parseInt(mapper.ui.modelTextInput.getText());
	if(isNaN(model))
		return;
	if(model < mapper.objectIdRange.min)
		return;
	if(model > mapper.objectIdRange.max)
		return;
	
	mapper.setObjectModel(model);
};

mapper.applyObjectSpinSpeed = function()
{
	var x = parseFloat(mapper.ui.spinX.getText());
	var y = parseFloat(mapper.ui.spinY.getText());
	var z = parseFloat(mapper.ui.spinZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.spinObjectSpeed = new Vec3(x, y, z);
};

mapper.applyBBMultiplier = function()
{
	var x = parseFloat(mapper.ui.bbMultiplierX.getText());
	var y = parseFloat(mapper.ui.bbMultiplierY.getText());
	var z = parseFloat(mapper.ui.bbMultiplierZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.bbMultiplier = new Vec3(x, y, z);
};

mapper.applyZoom = function()
{
	var zoom = parseFloat(mapper.ui.zoomTextInput.getText());
	if(isNaN(zoom))
		return;
	if(zoom <= 0.0)
		return;
	if(zoom > 1500.0)
		return;
	
	mapper.cameraZoom = zoom;
	mapper.updateCamera();
};

mapper.applyObjectPosition = function()
{
	var x = parseFloat(mapper.ui.posX.getText());
	var y = parseFloat(mapper.ui.posY.getText());
	var z = parseFloat(mapper.ui.posZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.object.position = new Vec3(x, y, z);
	mapper.updateCamera();
};

mapper.applyObjectRotation = function()
{
	var x = parseFloat(mapper.ui.rotX.getText());
	var y = parseFloat(mapper.ui.rotY.getText());
	var z = parseFloat(mapper.ui.rotZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.object.setRotation(new Vec3(x, y, z));
};

mapper.applyObjectPositionStep = function()
{
	var x = parseFloat(mapper.ui.posStepX.getText());
	var y = parseFloat(mapper.ui.posStepY.getText());
	var z = parseFloat(mapper.ui.posStepZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.objectPositionStep = new Vec3(x, y, z);
};

mapper.applyObjectRotationStep = function()
{
	var x = parseFloat(mapper.ui.rotStepX.getText());
	var y = parseFloat(mapper.ui.rotStepY.getText());
	var z = parseFloat(mapper.ui.rotStepZ.getText());
	if(isNaN(x) || isNaN(y) || isNaN(z))
		return;
	
	mapper.objectRotationStep = new Vec3(x, y, z);
};

// camera zoom
mapper.checkToZoomCamera = function()
{
	var lshift = isKeyDown(SDLK_LSHIFT);
	var rshift = isKeyDown(SDLK_RSHIFT);
	var shift = lshift || rshift;
	
	var multiplier;
	if(shift)
		multiplier = 0.25;
	else
		multiplier = 1.5;
	
	if(isKeyDown(SDLK_PAGEUP))
		mapper.zoomCamera(-multiplier);
	if(isKeyDown(SDLK_PAGEDOWN))
		mapper.zoomCamera(multiplier);
};

mapper.zoomCamera = function(multiplier)
{
	mapper.cameraZoom += multiplier;
	
	if(mapper.cameraZoom < mapper.minCameraZoom)
		mapper.cameraZoom = mapper.minCameraZoom;
	else if(mapper.cameraZoom > mapper.maxCameraZoom)
		mapper.cameraZoom = mapper.maxCameraZoom;
	
	mapper.updateCamera();
};

// snap to ground
mapper.snapToGround = function()
{
	var pos = util.getObjectGroundPosition(mapper.object);
	mapper.setObjectPosition(pos);
};

// object BB
mapper.getBBSize = function()
{
	return new Vec3(
		mapper.object.boundingMax.x - mapper.object.boundingMin.x,
		mapper.object.boundingMax.y - mapper.object.boundingMin.y,
		mapper.object.boundingMax.z - mapper.object.boundingMin.z
	);
};

/*
mapper.getRotatedPos = function()
{
	// Center position of the rectangle.
	var m_PosX = mapper.object.position.x;
	var m_PosY = mapper.object.position.y;
	// Half-width and half-height of the rectangle.
	var bbSize = mapper.getBBSize();
	var m_HalfSizeX = bbSize.x / 2.0;
	var m_HalfSizeY = bbSize.y / 2.0;
	// Rectangle orientation, in radians.
	var m_Orientation = mapper.objectToCameraZRotation + util.radians(180.0);

	// corner_1 is right-top corner of unrotated rectangle, relative to m_Pos.
	// corner_2 is right-bottom corner of unrotated rectangle, relative to m_Pos.
	var corner_1_x = m_HalfSizeX;
	var corner_2_x = m_HalfSizeX;
	var corner_1_y = -m_HalfSizeY;
	var corner_2_y =  m_HalfSizeY;

	var sin_o = Math.sin(m_Orientation);
	var cos_o = Math.cos(m_Orientation);

	// xformed_corner_1, xformed_corner_2 are points corner_1, corner_2 rotated by angle m_Orientation.
	var xformed_corner_1_x = corner_1_x * cos_o - corner_1_y * sin_o;
	var xformed_corner_1_y = corner_1_x * sin_o + corner_1_y * cos_o;
	var xformed_corner_2_x = corner_2_x * cos_o - corner_2_y * sin_o;
	var xformed_corner_2_y = corner_2_x * sin_o + corner_2_y * cos_o;

	// ex, ey are extents (half-sizes) of the final AABB.
	var ex = Math.max(Math.abs(xformed_corner_1_x), Math.abs(xformed_corner_2_x));
	var ey = Math.max(Math.abs(xformed_corner_1_y), Math.abs(xformed_corner_2_y));

	var aabb_min_x = m_PosX - ex;
	var aabb_max_x = m_PosX + ex;
	var aabb_min_y = m_PosY - ey;
	var aabb_max_y = m_PosY + ey;
	
	return [
		new Vec3(aabb_min_x, aabb_min_y, mapper.object.position.z),
		new Vec3(aabb_max_x, aabb_max_y, mapper.object.position.z)
	];
};
*/

function translate(b, v) {
	///*
	var a = [
		b.m11, b.m12, b.m13, b.m14,
		b.m21, b.m22, b.m23, b.m24,
		b.m31, b.m32, b.m33, b.m34,
		b.m41, b.m42, b.m43, b.m44
	];
	//*/
	/*
	var a = [
		b.m11, b.m21, b.m31, b.m41,
		b.m12, b.m22, b.m32, b.m42,
		b.m13, b.m23, b.m33, b.m43,
		b.m14, b.m24, b.m34, b.m44
	];
	*/
	
	var out = [];
	var x = v.x,
		y = v.y,
		z = v.z;
	var a00, a01, a02, a03;
	var a10, a11, a12, a13;
	var a20, a21, a22, a23;

	if (a === out)
	{
	  out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	  out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	  out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	  out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	}
	else
	{
	  a00 = a[0];
	  a01 = a[1];
	  a02 = a[2];
	  a03 = a[3];
	  a10 = a[4];
	  a11 = a[5];
	  a12 = a[6];
	  a13 = a[7];
	  a20 = a[8];
	  a21 = a[9];
	  a22 = a[10];
	  a23 = a[11];
	  out[0] = a00;
	  out[1] = a01;
	  out[2] = a02;
	  out[3] = a03;
	  out[4] = a10;
	  out[5] = a11;
	  out[6] = a12;
	  out[7] = a13;
	  out[8] = a20;
	  out[9] = a21;
	  out[10] = a22;
	  out[11] = a23;
	  out[12] = a00 * x + a10 * y + a20 * z + a[12];
	  out[13] = a01 * x + a11 * y + a21 * z + a[13];
	  out[14] = a02 * x + a12 * y + a22 * z + a[14];
	  out[15] = a03 * x + a13 * y + a23 * z + a[15];
	}
	//return out;
	return new Vec3(out[12], out[13], out[14]);
}

// utility
mapper.drawTextRight = function(x, y, text, size, colour)
{
	mapper.font1.render(text, new Vec2(gta.width - x, y), 0, 1.0, 0.0, size, colour);
};

mapper.updateCamera = function()
{
	var objectCentrePosition = mapper.getObjectCentrePosition();
	var cameraPosition = objectCentrePosition.addSpherical(mapper.cameraZoom, mapper.objectToCameraXYInclination, mapper.objectToCameraZRotation);
	
	var cameraLookAtPosition = objectCentrePosition;
	gta.setCameraLookAt(cameraPosition, cameraLookAtPosition, true);
};

mapper.updatePlayer = function()
{
	var position = util.getObjectGroundPosition(mapper.object);
	position.z -= 5.0;
	
	localPlayer.position = position;
	localPlayer.health = 100.0;
	if(localPlayer.vehicle)
		localPlayer.vehicle.health = 1000.0;
};

mapper.getRotatedBB = function()
{
	/*
	var m1 = new Matrix4x4;
	m1.setIdentity();
	m1.setTranslate(bb);
	
	var m2 = new Matrix4x4;
	m2.setIdentity();
	m2.setRotate(new Vec3(0.0, 0.0, zrot));
	
	m1.multiply(m2);
	
	return m1.getVector3(3);
	*/
	
	var min = mapper.object.boundingMin;
	var max = mapper.object.boundingMax;
	var pos = mapper.object.position;
	//var zrot = mapper.objectToCameraZRotation;
	var rot = mapper.object.getRotation();
	
	var minbb, maxbb;
	
	/*
	{
		var m1 = new Matrix4x4;
		m1.setIdentity();
		m1.setTranslate(min);
		var m2 = new Matrix4x4;
		m2.setIdentity();
		m2.setRotate(new Vec3(rot.x, rot.y, rot.z));
		m1.setMultiply(m1, m2);
		minbb = m1.getVector3(3);
		minbb.x += mapper.object.position.x;
		minbb.y += mapper.object.position.y;
		minbb.z += mapper.object.position.z + 5.0;
	}
	
	{
		var m1 = new Matrix4x4;
		m1.setIdentity();
		m1.setTranslate(max);
		var m2 = new Matrix4x4;
		m2.setIdentity();
		m2.setRotate(new Vec3(rot.x, rot.y, rot.z));
		m1.setMultiply(m1, m2);
		maxbb = m1.getVector3(3);
		maxbb.x += mapper.object.position.x;
		maxbb.y += mapper.object.position.y;
		maxbb.z += mapper.object.position.z + 5.0;
	}
	
	return [minbb, maxbb];
	*/
	
	
	//return mapper.object.matrix.transformCoordinate(bb);
	
	
	
	
	
	///*
	{
		var m = math.matrix([
			[mapper.object.matrix.m11, mapper.object.matrix.m12, mapper.object.matrix.m13, mapper.object.matrix.m14],
			[mapper.object.matrix.m21, mapper.object.matrix.m22, mapper.object.matrix.m23, mapper.object.matrix.m24],
			[mapper.object.matrix.m31, mapper.object.matrix.m32, mapper.object.matrix.m33, mapper.object.matrix.m34],
			[mapper.object.matrix.m41, mapper.object.matrix.m42, mapper.object.matrix.m43, mapper.object.matrix.m44]
		]);
		var v = [min.x, min.y, min.z, 0.0];
		var result = math.multiply(m, v);
		//console.log(result);
		minbb = new Vec3(result.subset(math.index(0)), result.subset(math.index(1)), result.subset(math.index(2)));
	}
	
	{
		var m = math.matrix([
			[mapper.object.matrix.m11, mapper.object.matrix.m12, mapper.object.matrix.m13, mapper.object.matrix.m14],
			[mapper.object.matrix.m21, mapper.object.matrix.m22, mapper.object.matrix.m23, mapper.object.matrix.m24],
			[mapper.object.matrix.m31, mapper.object.matrix.m32, mapper.object.matrix.m33, mapper.object.matrix.m34],
			[mapper.object.matrix.m41, mapper.object.matrix.m42, mapper.object.matrix.m43, mapper.object.matrix.m44]
		]);
		var v = [max.x, max.y, max.z, 0.0];
		var result = math.multiply(m, v);
		//console.log(result);
		maxbb = new Vec3(result.subset(math.index(0)), result.subset(math.index(1)), result.subset(math.index(2)));
	}
	
	minbb.x += mapper.object.position.x;
	minbb.y += mapper.object.position.y;
	minbb.z += mapper.object.position.z + 5.0;

	maxbb.x += mapper.object.position.x;
	maxbb.y += mapper.object.position.y;
	maxbb.z += mapper.object.position.z + 5.0;
	
	return [minbb, maxbb];
	//*/
	
	/*
	var n = [];
	n[0];
	
	return new Vec3((m[0] * v[0]) + (m[1] * v[1]) + (m[2] * v[2]) + m[3]);
	*/
	
	/*
	var m1 = new Matrix4x4;
	m1.setIdentity();
	m1.setTranslate(bb);
	m1.setRotate(new Vec3(0.0, 0.0, zrot));
	
	var m2 = new Matrix4x4;
	m2.setIdentity();
	*/
	
	//return mapper.object.matrix.transformCoordinate(bb);
	
	/*
	var mat = mapper.object.matrix;
	mat.setRotate(mapper.object.getRotation());
	return mat.transformCoordinate(bb);
	*/
	
	/*
	var bb2 = new Vec3(0.0, 0.0, 0.0);
	bb2.x = 0.0+(bb.x-0.0)*Math.cos(zrot)+(bb.y-0.0)*Math.sin(zrot);
	bb2.y = 0.0-(bb.x-0.0)*Math.sin(zrot)+(bb.y-0.0)*Math.cos(zrot);
	bb2.z = bb.z;
	return bb2;
	*/
};














