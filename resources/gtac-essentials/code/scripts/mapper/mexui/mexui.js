var mexui = {};

// data initialization
mexui.Entity			= {};
mexui.Component			= {};
mexui.Control			= {};
mexui.Entry				= {};

mexui.windows			= [];

mexui.fonts				= {};
mexui.images			= {};

mexui.focusedControl	= null;
mexui.hoveredComponent	= null;

// initialization
mexui.init = function()
{
	mexui.native.loadImage('mexui/Images/down-arrow.png', 'downArrow');
	mexui.bindEvents();
	mexui.startTimers();
};

// events
mexui.bindEvents = function()
{
	addEventHandler('onMouseDown', function(event, mouse, button)
	{
		var e = mexui.triggerEvent('onMouseDown', {button: button});
		if(!e.clickedAControl)
		{
			mexui.focusedControl = null;
		}
	});

	addEventHandler('onMouseUp', function(event, mouse, button)
	{
		mexui.triggerEvent('onMouseUp', {button: button});
	});

	addEventHandler('onMouseMove', function(event, mouse, isAbsolute, position)
	{
		if(isAbsolute)
			return;
		
		mexui.triggerEvent('onMouseMove', new Vec2(position.x, position.y), true);
	});

	addEventHandler('onMouseWheel', function(event, mouse, offset, flipped)
	{
		mexui.triggerEvent('onMouseWheel', offset);
	});

	addEventHandler('onKeyDown', function(event, key, pkey, mods)
	{
		mexui.triggerEvent('onKeyDown', key, mods);
		
		if(key == SDLK_TAB)
		{
			mexui.cycleFocusedControl();
		}
	});

	addEventHandler('onCharacter', function(event, character)
	{
		mexui.triggerEvent('onCharacter', character);
		
		if(character == 't' || character == 'T')
		{
			var textInput = mexui.getFocusedTextInput();
			if(textInput)
			{
				//event.preventDefault();
			}
		}
	});

	addEventHandler('onBeforeDrawHUD', function(event)
	{
		mexui.render();
	});
};

mexui.unbindEvents = function()
{
	removeEventHandler('onMouseDown');
	removeEventHandler('onMouseUp');
	removeEventHandler('onMouseMove');
	removeEventHandler('onMouseWheel');
	removeEventHandler('onKeyDown');
	removeEventHandler('onCharacter');
	removeEventHandler('onBeforeDrawHUD');
};

// timers
mexui.startTimers = function()
{
	setInterval(mexui.toggleTextInputCaretShownForBlink, 400);
};

// render
mexui.render = function()
{
	for(var i in mexui.windows)
	{
		if(mexui.windows[i].shown)
			mexui.windows[i].render.call(mexui.windows[i]);
	}
	for(var i in mexui.windows)
	{
		if(mexui.windows[i].shown)
			mexui.windows[i].renderAfter.call(mexui.windows[i]);
	}
};

// model
mexui.triggerEvent = function(eventName, data, callBaseMethodFirst)
{
	var e = new mexui.Component.Event();
	
	if(data.button !== undefined)
		e.button = data.button;
	
	var windows = mexui.windows.slice(0, mexui.windows.length).reverse();
	for(var i in windows)
	{
		if(windows[i].shown)
		{
			if(callBaseMethodFirst)
			{
				if(mexui.Entity.Component.prototype[eventName])
				{
					mexui.Entity.Component.prototype[eventName].call(windows[i], e, data);
					if(e.used)
						break;
				}
				
				windows[i][eventName].call(windows[i], e, data);
				if(e.used)
					break;
			}
			else
			{
				windows[i][eventName].call(windows[i], e, data);
				if(e.used)
					break;
				
				if(mexui.Entity.Component.prototype[eventName])
				{
					mexui.Entity.Component.prototype[eventName].call(windows[i], e, data);
					if(e.used)
						break;
				}
			}
		}
	}
	return e;
};

mexui.getTopWindow = function()
{
	for(var i = mexui.windows.length - 1, j = 0; i >= j; i--)
	{
		if(mexui.windows[i].shown)
			return mexui.windows[i];
	}
	return null;
};

mexui.getShownWindows = function()
{
	var shownWindows = [];
	for(var i = mexui.windows.length - 1, j = 0; i >= j; i--)
	{
		if(mexui.windows[i].shown)
			shownWindows.push(mexui.windows[i]);
	}
	return shownWindows;
};

mexui.getNextShownWindows = function(afterWindow)
{
	var shownWindows = mexui.getShownWindows();
	
	var windowIndex = shownWindows.indexOf(afterWindow);
	
	var windows2 = shownWindows.splice(0, windowIndex + 1);
	var args = windows2;
	args.unshift(0);
	args.unshift(shownWindows.length);
	shownWindows.splice.apply(shownWindows, args);
	
	return shownWindows;
};

mexui.cycleFocusedControl = function()
{
	// no windows are created
	if(mexui.windows.length == 0)
		return;
	
	// no control is focused
	if(!mexui.focusedControl)
	{
		var topWindow = mexui.getTopWindow();
		if(!topWindow)
			return;
		
		mexui.focusedControl = topWindow.getFirstShownControl();
		return;
	}
	
	// a control is focused
	var focusedControlWindow = mexui.focusedControl.window;
	var nextControl = focusedControlWindow.getNextShownControl(mexui.focusedControl);
	if(nextControl)
	{
		mexui.focusedControl = nextControl;
		return;
	}
	
	// set focus to first control on next window that has a control shown
	var shownWindows = mexui.getNextShownWindows(focusedControlWindow);
	for(var i in shownWindows)
	{
		var window = shownWindows[i];
		var firstControl = window.getFirstShownControl();
		if(firstControl)
		{
			mexui.focusedControl = firstControl;
			return;
		}
	}
};

mexui.getFocusedTextInput = function()
{
	if(!mexui.focusedControl)
		return null;
	
	if(!(mexui.focusedControl instanceof mexui.Control.TextInput))
		return null;
	
	return mexui.focusedControl;
};

mexui.toggleTextInputCaretShownForBlink = function()
{
	var textInput = mexui.getFocusedTextInput();
	if(!textInput)
		return;
	
	textInput.caretShownForBlink = !textInput.caretShownForBlink;
};

mexui.setHoveredComponent = function(component)
{
	//component.hovered = true;
	mexui.hoveredComponent = component;
};

mexui.clearHoveredComponent = function()
{
	//mexui.hoveredComponent.hovered = false;
	mexui.hoveredComponent = null;
};

// api
mexui.window = function(x, y, w, h, title, styles)
{
	var window = new mexui.Component.Window(x, y, w, h, title, styles);
	mexui.windows.push(window);
	return window;
};

mexui.isAnyWindowShown = function()
{
	for(var i in mexui.windows)
	{
		if(mexui.windows[i].shown)
			return true;
	}
	return false;
};

mexui.setInput = function(showInput)
{
	gui.showCursor(showInput, !showInput);
	if(localPlayer)
	{
		if(showInput)
			gta.setCameraLookAtEntity(new Vec3(gta.cameraMatrix.m41, gta.cameraMatrix.m42, gta.cameraMatrix.m43), localPlayer, false);
		else
			gta.restoreCamera(false);
	}
};

