mexui.Component.Window = function(x, y, w, h, title, styles)
{
	mexui.Entity.Component.call(this, true);
	mexui.Entity.StyleableEntity.call(this, this.linkComponentStyles('Window', styles));
	
	this.position				= new Vec2(x, y);
	this.size					= new Vec2(w, h);
	this.title					= title || '';
	
	this.controls				= [];
	this.titleBarShown			= true;
	this.titleBarHeight			= 30;
	this.titleBarIconShown		= true;
	this.titleBarIconSize		= new Vec2(30, 30);
};
mexui.util.extend(mexui.Component.Window, mexui.Entity.Component);

// default styles
mexui.Component.Window.defaultStyles = mexui.util.linkStyles(mexui.Entity.StyleableEntity.defaultStyles, {
	main:
	{
		backgroundColour:	toColour(0, 0, 0, 190),
		textColour:			toColour(255, 255, 255, 255),
		
		hover:
		{
			backgroundColour:	toColour(0, 0, 0, 170)
		}
	},
	title:
	{
		backgroundColour:	toColour(79, 161, 246, 190),
		textColour:			toColour(0, 0, 0, 255)
	},
	icon:
	{
		backgroundColour:	toColour(245, 5, 5, 190),
		textColour:			toColour(0, 0, 0, 255),
		textSize:			21,
		textAlign:			0.5,
		textIndent:			0
	}
});

// input
mexui.Component.Window.prototype.onMouseDown = function(e)
{
	if(e.button == 0 && this.titleBarShown && this.titleBarIconShown && this.isCursorOverCloseIcon())
	{
		this.shown = false;
		mexui.setInput(false);
		e.used = true;
		return;
	}
	
	if(this.isCursorOverWindow())
	{
		this.setTop();
	}
	
	this.triggerEvent('onMouseDown', e);
};

mexui.Component.Window.prototype.onMouseUp = function(e)
{
	this.triggerEvent('onMouseUp', e);
};

mexui.Component.Window.prototype.onMouseMove = function(e, offset)
{
	//var wasHovered = this.isHovered();
	//e.wasHovered = wasHovered;
	
	if(mexui.hoveredComponent && !mexui.hoveredComponent.isCursorOverItem())
	{
		mexui.hoveredComponent.onMouseExit();
		mexui.clearHoveredComponent();
	}
	
	this.triggerEvent('onMouseMove', e, offset);
	
	if(e.used)
	{
		/*
		if(wasHovered)
		{
			mexui.clearHoveredComponent();
			this.onMouseExit();
		}
		*/
		return;
	}
	
	if(this.isCursorOverWindow())
	{
		if(!this.isHovered())
		{
			mexui.setHoveredComponent(this);
			this.onMouseEnter();
		}
		e.used = true;
	}
	/*
	else if(wasHovered)
	{
		mexui.clearHoveredComponent();
		this.onMouseExit();
	}
	*/
};

mexui.Component.Window.prototype.onMouseWheel = function(e, data)
{
	this.triggerEvent('onMouseWheel', e, data);
};

mexui.Component.Window.prototype.onKeyDown = function(e, key, mods)
{
	this.triggerEvent('onKeyDown', e, key, mods);
};

mexui.Component.Window.prototype.onCharacter = function(e, character)
{
	this.triggerEvent('onCharacter', e, character);
};

// render
mexui.Component.Window.prototype.render = function()
{
	// window background
	mexui.native.drawRectangleBackground(this.position, this.size, this.getStyles('main'));
	
	if(this.titleBarShown)
	{
		// window title bar
		mexui.native.drawRectangle(this.position, new Vec2(this.size.x, this.titleBarHeight), this.getStyles('title'));
		mexui.native.drawText(this.position, new Vec2(this.size.x, this.titleBarHeight), this.title, this.getStyles('title'));
		
		if(this.titleBarIconShown)
		{
			// window title bar icons
			var iconPos = this.getCloseIconPosition();
			mexui.native.drawRectangle(iconPos, this.titleBarIconSize, this.getStyles('icon'));
			mexui.native.drawText(iconPos, this.titleBarIconSize, 'X', this.getStyles('icon'));
		}
	}
	
	// window border
	mexui.native.drawRectangleBorder(this.position, this.size, this.getStyles('main'));
	
	// window controls
	var show, control;
	for(var i in this.controls)
	{
		control = this.controls[i];
		show = false;
		
		if(control.shown)
		{
			show = true;
			if(control.boundTo)
			{
				if(!control.isInsideBoundControl())
					show = false;
			}
		}
		
		if(show)
			control.render.call(control);
	}
};

mexui.Component.Window.prototype.renderAfter = function()
{
	for(var i in this.controls)
	{
		if(this.controls[i].shown)
		{
			this.controls[i].renderAfter.call(this.controls[i]);
			
			for(var i2 in this.controls[i].scrollBars)
			{
				if(this.controls[i].scrollBars[i2].shown)
					this.controls[i].scrollBars[i2].renderAfter(this.controls[i].scrollBars[i2]);
			}
		}
	}
};

// model
mexui.Component.Window.prototype.center = function()
{
	this.position = mexui.util.getCenterPosition(mexui.util.getWindowSize(), this.size);
};

mexui.Component.Window.prototype.setTop = function()
{
	mexui.windows.splice(mexui.windows.indexOf(this), 1);
	mexui.windows.push(this);
};

mexui.Component.Window.prototype.remove = function()
{
	mexui.windows.splice(mexui.windows.indexOf(this), 1);
};

mexui.Component.Window.prototype.isCursorOverCloseIcon = function()
{
	return mexui.util.isCursorInRectangle(this.getCloseIconPosition(), this.titleBarIconSize);
};

mexui.Component.Window.prototype.getCloseIconPosition = function()
{
	return new Vec2(this.position.x + (this.size.x - this.titleBarIconSize.x), this.position.y);
};

mexui.Component.Window.prototype.triggerEvent = function(eventName, e, data, callBaseMethodFirst)
{
	for(var i in this.controls)
	{
		var control = this.controls[i];
		
		if(!control.shown)
			continue;
		
		if(callBaseMethodFirst)
		{
			if(mexui.Entity.Component.prototype[eventName])
			{
				mexui.Entity.Component.prototype[eventName].call(control, e, data);
				if(e.used)
					break;
			}
			
			this.controls[i][eventName].call(control, e, data);
			if(e.used)
				break;
		}
		else
		{
			this.controls[i][eventName].call(control, e, data);
			if(e.used)
			{
				if(e.button == 0 && eventName == 'onMouseDown')
				{
					mexui.focusedControl = this.controls[i];
					e.clickedAControl = true;
				}
				break;
			}
			
			if(mexui.Entity.Component.prototype[eventName])
			{
				mexui.Entity.Component.prototype[eventName].call(control, e, data);
				if(e.used)
					break;
			}
		}
	}
};

mexui.Component.Window.prototype.addControl = function(control)
{
	this.controls.push(control);
	return control;
};

mexui.Component.Window.prototype.setShown = function(shown)
{
	//var anyWindowShownBefore = mexui.isAnyWindowShown();
	
	this.shown = shown;
	
	if(mexui.focusedControl && this.isControlInWindow(mexui.focusedControl))
	{
		if(!shown)
		{
			mexui.focusedControl = null;
		}
	}
	
	/*
	if(shown)
	{
		if(!anyWindowShownBefore)
			mexui.bindEvents();
	}
	else
	{
		if(!mexui.isAnyWindowShown())
			mexui.unbindEvents();
	}
	*/
};

mexui.Component.Window.prototype.isShown = function()
{
	return this.shown;
};

mexui.Component.Window.prototype.isControlInWindow = function(control)
{
	for(var i in this.controls)
	{
		if(control == this.controls[i])
			return true;
	}
	return false;
};

mexui.Component.Window.prototype.isCursorOverWindow = function()
{
	return mexui.util.isCursorInRectangle(this.position, this.size);
};

mexui.Component.Window.prototype.isCursorOverItem = function()
{
	return this.isCursorOverWindow();
};

mexui.Component.Window.prototype.getScreenPosition = function()
{
	return this.position;
};

mexui.Component.Window.prototype.getFirstShownControl = function()
{
	for(var i in this.controls)
	{
		if(this.controls[i].shown)
			return this.controls[i];
	}
	return null;
};

mexui.Component.Window.prototype.getNextShownControl = function(afterControl)
{
	var controlIndex = this.controls.indexOf(afterControl);
	
	if(this.controls[controlIndex + 1])
		return this.controls[controlIndex + 1];
	else
		return null;
};

// api
mexui.Component.Window.prototype.button			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Button(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.character		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Character(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.characters		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Characters(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.checkBox		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.CheckBox(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.day			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Day(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.date			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Date(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.digit			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Digit(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.digits			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Digits(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.dropDown		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.DropDown(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.grid			= function(x, y, w, h, styles)					{	return this.addControl(new mexui.Control.Grid(this, x, y, w, h, styles));							};
mexui.Component.Window.prototype.hour			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Hour(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.image			= function(x, y, w, h, filePath, styles)		{	return this.addControl(new mexui.Control.Image(this, x, y, w, h, filePath, styles));				};
mexui.Component.Window.prototype.integer		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Integer(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.letter			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Letter(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.letters		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Letters(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.letterDigit	= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.LetterDigit(this, x, y, w, h, text, styles, callback));	};
mexui.Component.Window.prototype.lettersDigits	= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.LettersDigits(this, x, y, w, h, text, styles, callback));	};
mexui.Component.Window.prototype.line			= function(x, y, w, h, styles, callback)		{	return this.addControl(new mexui.Control.Line(this, x, y, w, h, styles, callback));					};
mexui.Component.Window.prototype.list			= function(x, y, w, h, styles, callback)		{	return this.addControl(new mexui.Control.List(this, x, y, w, h, styles, callback));					};
mexui.Component.Window.prototype.minute			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Minute(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.month			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Month(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.number			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Number(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.password		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Password(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.positiveInteger	= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.PositiveInteger(this, x, y, w, h, text, styles, callback));	};
mexui.Component.Window.prototype.positiveNumber		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.PositiveNumber(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.progressBar	= function(x, y, w, h, text, styles)			{	return this.addControl(new mexui.Control.ProgressBar(this, x, y, w, h, text, styles));				};
mexui.Component.Window.prototype.radioButton	= function(x, y, w, h, text, groupId, styles, callback)		{	return this.addControl(new mexui.Control.RadioButton(this, x, y, w, h, text, groupId, styles, callback));		};
mexui.Component.Window.prototype.rangedInteger	= function(x, y, w, h, text, min, max, styles, callback)	{	return this.addControl(new mexui.Control.RangedInteger(this, x, y, w, h, text, min, max, styles, callback));	};
mexui.Component.Window.prototype.rangedNumber	= function(x, y, w, h, text, min, max, styles, callback)	{	return this.addControl(new mexui.Control.RangedNumber(this, x, y, w, h, text, min, max, styles, callback));		};
mexui.Component.Window.prototype.rectangle		= function(x, y, w, h, styles, callback)		{	return this.addControl(new mexui.Control.Rectangle(this, x, y, w, h, styles, callback));			};
mexui.Component.Window.prototype.scrollBar		= function(x, y, w, h, isVertical, styles, callback)		{	return this.addControl(new mexui.Control.ScrollBar(this, x, y, w, h, isVertical, styles, callback));			};
mexui.Component.Window.prototype.second			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Second(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.slider			= function(x, y, w, h, isVertical, text, minText, maxText, styles, callback)	{	return this.addControl(new mexui.Control.Slider(this, x, y, w, h, isVertical, text, minText, maxText, styles, callback));	};
mexui.Component.Window.prototype.tabPanel		= function(x, y, w, h, styles, callback)		{	return this.addControl(new mexui.Control.TabPanel(this, x, y, w, h, styles, callback));				};
mexui.Component.Window.prototype.text			= function(x, y, w, h, text, styles)			{	return this.addControl(new mexui.Control.Text(this, x, y, w, h, text, styles));						};
mexui.Component.Window.prototype.textArea		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.TextArea(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.textInput		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.TextInput(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.time			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Time(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.tree			= function(x, y, w, h, styles, callback)		{	return this.addControl(new mexui.Control.Tree(this, x, y, w, h, styles, callback));					};
mexui.Component.Window.prototype.week			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Week(this, x, y, w, h, text, styles, callback));			};
mexui.Component.Window.prototype.weekDay		= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.WeekDay(this, x, y, w, h, text, styles, callback));		};
mexui.Component.Window.prototype.year			= function(x, y, w, h, text, styles, callback)	{	return this.addControl(new mexui.Control.Year(this, x, y, w, h, text, styles, callback));			};

