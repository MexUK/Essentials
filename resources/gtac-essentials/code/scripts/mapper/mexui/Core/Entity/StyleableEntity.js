mexui.Entity.StyleableEntity = function(styles)
{
	this.styles						= styles;
	
	this.shown						= true;
	//this.hovered					= false;
	
	this.transitions				= {};		// string controlPartName => Transition transition
	
	/*
	this.transitionDelayTimer		= null;
	this.transitionStartTime		= 0;
	this.transitionEndTime			= 0;
	this.transitionIsProcessing		= false;
	this.transitionIsReverting		= false;
	this.transitionProgressReached	= 0.0;
	*/
};

// default styles
mexui.Entity.StyleableEntity.globalDefaultStyles = {
	all:
	{
		textFont:			'Arial',
		textSize:			14.0,
		textAlign:			0.0,
		textIndent:			5,
		textColour:			toColour(0, 0, 0, 255),
		
		backgroundColour:	toColour(255, 255, 255, 255),
		
		lineWeight:			1
	}
};

mexui.Entity.StyleableEntity.defaultStyles = mexui.util.linkGlobalStyles(mexui.Entity.StyleableEntity.globalDefaultStyles, {
	main:
	{
		backgroundColour:	toColour(255, 255, 255, 255),
		borderColour:		'none',
		textColour:			toColour(0, 0, 0, 255),
		
		hover:
		{
			backgroundColour:	toColour(220, 220, 220, 255),
			borderColour:		'none',
			textColour:			toColour(0, 0, 0, 255)
		}/*,
		
		focus:
		{
			borderColour:		toColour(255, 128, 0, 230),
			textColour:			toColour(0, 0, 0, 255)
		}
		*/
	},
	focused:
	{
		borderColour:		toColour(28, 119, 198, 255)
	},
	invalidValue:
	{
		borderColour:		toColour(250, 5, 5, 255)
	}
});

// model
mexui.Entity.StyleableEntity.prototype.linkControlStyles = function(controlName, styles)
{
	return mexui.util.linkStyles(mexui.Control[controlName].defaultStyles, styles);
};

mexui.Entity.StyleableEntity.prototype.linkComponentStyles = function(componentName, styles)
{
	return mexui.util.linkStyles(mexui.Component[componentName].defaultStyles, styles);
};

mexui.Entity.StyleableEntity.prototype.linkEntryStyles = function(entryName, styles)
{
	return mexui.util.linkStyles(mexui.Entry[entryName].defaultStyles, styles);
};

mexui.Entity.StyleableEntity.prototype.isFocused = function()
{
	return this == mexui.focusedControl;
};

mexui.Entity.StyleableEntity.prototype.isHovered = function()
{
	//return this.hovered;
	return this == mexui.hoveredComponent;
};

mexui.Entity.StyleableEntity.prototype.getStyles = function(controlPartName)
{
	var isFocused = this.isFocused();
	var isHovered = this.isHovered();
	var styles = this.styles[controlPartName];
	
	var transition = this.getTransition(controlPartName);
	
	if(transition.isProcessing())
	{
		return mexui.util.getTransitionStyles(styles, ['hover'], transition.getMainToPseudoProgress());
	}
	
	if(isHovered)
	{
		return mexui.util.mergeStyles(styles, ['hover']);
	}
	
	return styles;
};

mexui.Entity.StyleableEntity.prototype.getEntryStyles = function(data)
{
	var styles = {};
	
	for(var i in data)
	{
		var baseStyles = data[i][0].getStyles(data[i][1]);
		
		for(var k in baseStyles)
		{
			if(baseStyles.hasOwnProperty(k) && styles[k] === undefined)
			{
				styles[k] = baseStyles[k];
			}
		}
	}
	
	for(var i in data)
	{
		var baseStyles = data[i][0].getStyles(data[i][1]);
		
		for(var k in baseStyles)
		{
			if(styles[k] === undefined)
			{
				styles[k] = baseStyles[k];
			}
		}
	}
	
	return styles;
};

// custom events
mexui.Entity.StyleableEntity.prototype.onMouseEnter = function()
{
	var controlParts = this.getControlPartsWithTransition();
	for(var i in controlParts)
	{
		var transition = this.getTransition(controlParts[i]);
		
		var delay = this.getTransitionDelayStyle(controlParts[i]);
		var time = this.getTransitionTimeStyle(controlParts[i]);
		
		transition.onMouseEnter(delay, time);
	}
};

mexui.Entity.StyleableEntity.prototype.onMouseExit = function()
{
	var controlParts = this.getControlPartsWithTransition();
	for(var i in controlParts)
	{
		var transition = this.getTransition(controlParts[i]);
		
		transition.onMouseExit();
	}
};

// transitions
mexui.Entity.StyleableEntity.prototype.getTransition = function(controlPartName)
{
	if(!this.transitions[controlPartName])
		this.transitions[controlPartName] = new mexui.Entity.Transition;
	return this.transitions[controlPartName];
};

mexui.Entity.StyleableEntity.prototype.getControlPartsWithTransition = function()
{
	var controlParts = [];
	for(var k in this.styles)
	{
		if(this.styles[k].hover && (this.styles[k].hover.transitionTime != null || this.styles[k].hover.transitionDelay != null))
		{
			controlParts.push(k);
		}
	}
	return controlParts;
};

mexui.Entity.StyleableEntity.prototype.getTransitionDelayStyle = function(controlPartName)
{
	if(this.styles[controlPartName].hover.transitionDelay != null)
		return this.styles[controlPartName].hover.transitionDelay;
	else
		return mexui.Entity.Transition.defaultTransitionDelay;
};

mexui.Entity.StyleableEntity.prototype.getTransitionTimeStyle = function(controlPartName)
{
	if(this.styles[controlPartName].hover.transitionTime != null)
		return this.styles[controlPartName].hover.transitionTime;
	else
		return mexui.Entity.Transition.defaultTransitionTime;
};

