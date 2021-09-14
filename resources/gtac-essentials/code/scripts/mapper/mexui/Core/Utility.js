mexui.util = {};

// static
mexui.util.monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
mexui.util.weekDayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// functions
mexui.util.extend = function(d, b)
{
	d.prototype = Object.create(b.prototype);
	d.prototype.constructor = b;
};

mexui.util.isPointInRectangle = function(point, position, size)
{
	if(!point)
		return false; // temp bug fix
	
	return point.x >= position.x && point.y >= position.y && point.x <= (position.x + size.x) && point.y <= (position.y + size.y);
};

mexui.util.isCursorInRectangle = function(position, size)
{
	return mexui.util.isPointInRectangle(gui.cursorPosition, position, size);
};

mexui.util.addVec2 = function(vec2a, vec2b)
{
	return new Vec2(vec2a.x + vec2b.x, vec2a.y + vec2b.y);
};

mexui.util.subtractVec2 = function(vec2a, vec2b)
{
	return new Vec2(vec2a.x - vec2b.x, vec2a.y - vec2b.y);
};

mexui.util.addVec3 = function(vec3a, vec3b)
{
	return new Vec3(vec3a.x + vec3b.x, vec3a.y + vec3b.y, vec3a.z + vec3b.z);
};

mexui.util.createControlConstructor = function(controlName, hasEntries, constructor)
{
	mexui.Control[controlName] = constructor;
	mexui.util.extend(mexui.Control[controlName], hasEntries ? mexui.Entity.ControlWithEntries : mexui.Component.Control);
};

mexui.util.linkBaseControlStyles = function(controlName, derivedStyles)
{
	mexui.Control[controlName].defaultStyles = mexui.util.linkStyles(mexui.Component.Control.defaultStyles, derivedStyles);
};

mexui.util.linkStyles = function(baseStyles, derivedStyles)
{
	derivedStyles = derivedStyles || {};
	
	for(var k in baseStyles)
	{
		switch(k)
		{
			case 'focus':
			case 'hover':
				continue;
		}
		
		if(!derivedStyles[k])
			derivedStyles[k] = {};
		if(!(derivedStyles[k].__proto__ instanceof Object))
			derivedStyles[k].__proto__ = baseStyles[k];
		
		/*
		var hoverBaseStyles = JSON.parse(JSON.stringify(baseStyles[k]));
		if(!derivedStyles[k].hover)
			derivedStyles[k].hover = {};
		if(!(derivedStyles[k].hover.__proto__ instanceof Object))
			derivedStyles[k].hover.__proto__ = hoverBaseStyles;
		*/
	}
	
	return mexui.util.linkGlobalStyles(mexui.Entity.StyleableEntity.globalDefaultStyles, derivedStyles);
	//return derivedStyles;
};

mexui.util.linkGlobalStyles = function(baseStyles, derivedStyles)
{
	derivedStyles = derivedStyles || {};
	
	for(var k in derivedStyles)
	{
		switch(k)
		{
			case 'focus':
			case 'hover':
				continue;
		}
		
		if(!(derivedStyles[k].__proto__ instanceof Object))
		{
			derivedStyles[k].__proto__ = baseStyles.all;
		}
	}
	
	for(var k in derivedStyles)
	{
		switch(k)
		{
			case 'focus':
			case 'hover':
				continue;
		}
		
		/*
		if(!derivedStyles[k].hasOwnProperty('hover'))
		{
			derivedStyles[k].hover = {};
			derivedStyles[k].hover.__proto__ = derivedStyles[k];
		}
		*/
		
		if(derivedStyles[k].focus)
		{
			if(!(derivedStyles[k].focus.__proto__ instanceof Object))
			{
				derivedStyles[k].focus.__proto__ = baseStyles.all;
			}
			
			if(derivedStyles[k].focus.hover)
			{
				if(!(derivedStyles[k].focus.hover.__proto__ instanceof Object))
				{
					derivedStyles[k].focus.hover.__proto__ = baseStyles.all;
				}
			}
		}
		
		if(derivedStyles[k].hover)
		{
			if(!(derivedStyles[k].hover.__proto__ instanceof Object))
			{
				derivedStyles[k].hover.__proto__ = baseStyles.all;
			}
		}
	}
	
	return derivedStyles;
};

String.prototype.repeat = function(count)
{
	return Array(count + 1).join(this);
};

mexui.util.isLetter = function(character)
{
	var ord = character.charCodeAt(0);
	return (ord >= 65 && ord <= 90) || (ord >= 97 && ord <= 122);
};

mexui.util.isDigit = function(character)
{
	var ord = character.charCodeAt(0);
	return ord >= 48 && ord <= 57;
};

mexui.util.isLetterOrDigit = function(character)
{
	return mexui.util.isLetter(character) || mexui.util.isDigit(character);
};

mexui.util.isCharacterInOctetRange = function(character, min, max)
{
	var ord = character.charCodeAt(0);
	return ord >= min && ord <= max;
};

mexui.util.interpolateScalar = function(a, b, f)
{
	return a + ((b - a) * f);
};

mexui.util.doesContainEOLChar = function(text)
{
	return text.indexOf("\n") != -1 || text.indexOf("\r") != -1;
};

mexui.util.splitLines = function(text)
{
	text = text.replace("\r\n", "\n");
	text = text.replace("\r", "\n");
	return text.split("\n");
};

mexui.util.getStringCount = function(text, find)
{
	var count = 0;
	var index = 0;
	for(;;)
	{
		index = text.indexOf(find, index);
		if(index == -1)
			break;
		count++;
		index += find.length;
	}
	return count;
};

mexui.util.stack = function()
{
	var err = new Error();
	console.log(err.stack);
};

mexui.util.deg = function(rad)
{
	return rad * (180 / Math.PI);
};

mexui.util.rad = function(deg)
{
	return deg * (Math.PI / 180);
};

mexui.util.round = function(x, n)
{
	return parseFloat(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
};

mexui.util.getCenterPosition = function(largerSize, smallerSize)
{
	return new Vec2(
		(largerSize.x - smallerSize.x) / 2.0,
		(largerSize.y - smallerSize.y) / 2.0
	);
};

mexui.util.getWindowSize = function()
{
	return new Vec2(gta.width, gta.height);
};

mexui.util.isRectangleInsideRectangle = function(pos1, size1, pos2, size2)
{
	return !(pos2.x > (pos1.x + size1.x) || 
           (pos2.x + size2.x) < pos1.x || 
           pos2.y > (pos1.y + size1.y) ||
           (pos2.y + size2.y) < pos1.y);
};

mexui.util.mergeStyles = function(styles, pseudoPartNames)
{
	var styles3 = {};
	var styles2 = [styles];
	while(styles2[0])
	{
		styles2 = [styles2[0]];
		for(var i in pseudoPartNames)
		{
			var pseudoPartName = pseudoPartNames[i];
			
			if(styles2[0] && styles2[0].hasOwnProperty(pseudoPartName))
				styles2.push(styles2[0][pseudoPartName]);
		}
		
		for(var i=styles2.length-1; i>=0; i--)
		{
			if(styles2[i] == null)
				continue;
			
			for(var k in styles2[i])
			{
				switch(k)
				{
					case 'focus':
					case 'hover':
					
					case 'transitionTime':
					case 'transitionDelay':
					
					case 'transitionDelayStartTime':
					case 'transitionStartTime':
					case 'transitionStarted':
					case 'transitionEnded':
					case 'transitionReverting':
					
						continue;
				}
				if(styles2[i].hasOwnProperty(k) && styles3[k] == null)
				{
					var styleValue = styles2[i][k];
					
					/*
					if(i > 0 && (styles2[i].transitionTime != null || styles2[i].transitionDelay != null))
					{
						var timeNow = mexui.util.time();
						if(styles2[i].transitionReverting)
						{
							var transitionTime = styles2[i].transitionTime == null ? 400 : styles2[i].transitionTime;
							var progress = (timeNow - styles2[i].transitionStartTime) / transitionTime;
							if(progress > 1.0)
							{
								styles2[i].transitionEnded = true;
								styleValue = styles2[0][k];
								
								delete styles2[i].transitionDelayStartTime;
								delete styles2[i].transitionStartTime;
								delete styles2[i].transitionStarted;
								delete styles2[i].transitionEnded;
								delete styles2[i].transitionReverting;
							}
							else
							{
								styleValue = mexui.util.interpolateStyle(k, progress, styles2[i][k], styles2[0][k]);
							}
						}
						else if(styles2[i].transitionEnded)
						{
							styleValue = styles2[i][k];
						}
						else if(styles2[i].transitionStarted)
						{
							var transitionTime = styles2[i].transitionTime == null ? 400 : styles2[i].transitionTime;
							var progress = (timeNow - styles2[i].transitionStartTime) / transitionTime;
							if(progress > 1.0)
							{
								styles2[i].transitionEnded = true;
								styleValue = styles2[i][k];
							}
							else
							{
								styleValue = mexui.util.interpolateStyle(k, progress, styles2[0][k], styles2[i][k]);
							}
						}
						else if(styles2[i].transitionDelayStartTime)
						{
							var transitionDelay = styles2[i].transitionDelay == null ? 0 : styles2[i].transitionDelay;
							if(timeNow >= (styles2[i].transitionDelayStartTime + transitionDelay))
							{
								styles2[i].transitionStarted = true;
								styles2[i].transitionStartTime = timeNow;
								styleValue = styles2[0][k];
							}
						}
						else
						{
							styles2[i].transitionDelayStartTime = timeNow;
							styleValue = styles2[0][k];
						}
					}
					*/
					
					styles3[k] = styleValue;
				}
			}
		}
		
		for(var i in styles2)
		{
			if(styles2[i])
				styles2[i] = styles2[i].__proto__;
		}
	}
	
	return styles3;
};

mexui.util.getTransitionStyles = function(styles, pseudoPartNames, progress)
{
	var styles3 = {};
	var styles2 = [styles];
	while(styles2[0])
	{
		styles2 = [styles2[0]];
		for(var i in pseudoPartNames)
		{
			var pseudoPartName = pseudoPartNames[i];
			
			if(styles2[0] && styles2[0].hasOwnProperty(pseudoPartName))
				styles2.push(styles2[0][pseudoPartName]);
		}
		
		for(var i=styles2.length-1; i>=0; i--)
		{
			if(styles2[i] == null)
				continue;
			
			for(var k in styles2[i])
			{
				switch(k)
				{
					case 'focus':
					case 'hover':
					
					case 'transitionTime':
					case 'transitionDelay':
						
						continue;
				}
				if(styles2[i].hasOwnProperty(k) && styles3[k] == null)
				{
					var styleValue = styles2[i][k];
					
					if(i > 0)
					{
						var mainStyleValue = styles2[0][k];
						var pseudoStyleValue = styles2[i][k];
						
						//console.log(mainStyleValue+' '+pseudoStyleValue);
						
						styleValue = mexui.util.interpolateStyle(k, progress, mainStyleValue, pseudoStyleValue);
					}
					
					styles3[k] = styleValue;
				}
			}
		}
		
		for(var i in styles2)
		{
			if(styles2[i])
				styles2[i] = styles2[i].__proto__;
		}
	}
	
	return styles3;
};

mexui.util.interpolateStyle = function(styleName, progress, styleValueFrom, styleValueTo)
{
	switch(styleName)
	{
		case 'backgroundColour':
		case 'backgroundColor':
		case 'textColour':
		case 'textColor':
		case 'lineColour':
		case 'lineColor':
		case 'borderColour':
		case 'borderColor':
			if(styleValueFrom == 'none')
				styleValueFrom = toColour(255, 255, 255, 0);
			if(styleValueTo == 'none')
				styleValueTo = toColour(255, 255, 255, 0);
			return mexui.util.interpolateColour(progress, styleValueFrom, styleValueTo);
		default:
			return mexui.util.interpolateScalar(progress, styleValueFrom, styleValueTo);
	}
};

mexui.util.interpolateColour = function(progress, styleValueFrom, styleValueTo)
{
	var rgbFrom = mexui.util.fromColour(styleValueFrom);
	var rgbTo = mexui.util.fromColour(styleValueTo);
	var rgba = [];
	for(var i=0; i<4; i++)
	{
		rgba[i] = mexui.util.interpolateScalar(progress, rgbFrom[i], rgbTo[i]);
	}
	return toColour.apply(null, rgba);
};

mexui.util.interpolateScalar = function(progress, valueFrom, valueTo)
{
	return valueFrom + ((valueTo - valueFrom) * progress);
};

mexui.util.fromColour = function(colour)
{
	return [
		(colour >> 16) & 0xFF,
		(colour >> 8) & 0xFF,
		colour & 0xFF,
		(colour >> 24) & 0xFF
	];
};

mexui.util.time = function()
{
	return gta.tickCount;
};

mexui.util.isIntChar = function(character)
{
	return mexui.util.isPositiveIntChar(character);
};

mexui.util.isPositiveIntChar = function(character)
{
	return mexui.util.isDigit(character) || character == '-' || character == '+' || character == 'e' || character == 'E';
};

mexui.util.isFloatChar = function(character)
{
	return mexui.util.isIntChar(character) || character == '.';
};

mexui.util.isPositiveFloatChar = function(character)
{
	return mexui.util.isPositiveIntChar(character) || character == '.';
};

mexui.util.isInt = function(str)
{
	var strInt = parseInt(str);
	return !isNaN(strInt) && str.length == (strInt+'').length;
};

mexui.util.isPositiveInt = function(str)
{
	var strInt = parseInt(str);
	return !isNaN(strInt) && strInt >= 0 && str.length == (strInt+'').length;
};

mexui.util.isFloat = function(str)
{
	var strFloat = parseFloat(str);
	var firstDot = str.indexOf('.');
	var addOffset = (str.substr(str.length - 2, 2) == '.0' && firstDot == (str.length - 2)) ? 2 : 0;
	if(firstDot == 0)
		addOffset--;
	return !isNaN(strFloat) && str.length == ((strFloat+'').length + addOffset);
};

mexui.util.isPositiveFloat = function(str)
{
	var strFloat = parseFloat(str);
	var firstDot = str.indexOf('.');
	var addOffset = (str.substr(str.length - 2, 2) == '.0' && firstDot == (str.length - 2)) ? 2 : 0;
	if(firstDot == 0)
		addOffset--;
	return !isNaN(strFloat) && strFloat >= 0.0 && str.length == ((strFloat+'').length + addOffset);
};

mexui.util.isMonthName = function(text)
{
	return mexui.util.inArrayOrStartsWithInArray(text, mexui.util.monthNames, 3);
};

mexui.util.isWeekDayName = function(text)
{
	return mexui.util.inArrayOrStartsWithInArray(text, mexui.util.weekDayNames, 3);
};

mexui.util.isDayIdSuffix = function(text)
{
	switch(text.toLowerCase())
	{
		case 'st':
		case 'nd':
		case 'rd':
		case 'th':
			return true;
	}
	return false;
};

mexui.util.isDayIdSuffixForDayId = function(dayId, text)
{
	switch(text.toLowerCase())
	{
		case 'st':		return dayId == 1 || dayId == 21 || dayId == 31;
		case 'nd':		return dayId == 2 || dayId == 22;
		case 'rd':		return dayId == 3 || dayId == 23;
		case 'th':		return !(dayId >= 1 && dayId <= 3) && !(dayId >= 21 && dayId <= 23) && dayId != 31;
		default:		return false;
	}
};

mexui.util.isDayId = function(text)
{
	if(text.length == 2 && text.substr(0, 1) == '0')
		text = text.substr(1);
	
	if(mexui.util.isPositiveInt(text))
	{
		var _int = parseInt(text);
		if(_int >= 1 && _int <= 31)
			return true;
	}
	
	return false;
};

mexui.util.isDayIdWithOptionalSuffix = function(text)
{
	if(mexui.util.isDayId(text))
		return true;
	
	if(text.length > 2)
	{
		var last2Chars = text.substr(text.length - 2, 2);
		if(mexui.util.isDayIdSuffix(last2Chars))
		{
			var textWithoutLast2Chars = text.substr(0, text.length - 2);
			if(mexui.util.isDayId(textWithoutLast2Chars) && mexui.util.isDayIdSuffixForDayId(parseInt(textWithoutLast2Chars), last2Chars))
			{
				return true;
			}
		}
	}
	
	return false;
};

mexui.util.inArrayOrStartsWithInArray = function(text, arr, startsWithCharCount)
{
	text = text.toLowerCase();
	
	for(var i in arr)
	{
		if(text === arr[i])
		{
			return true;
		}
	}
	
	if(text.length == startsWithCharCount)
	{
		for(var i in arr)
		{
			if(text === arr[i].substr(0, startsWithCharCount))
			{
				return true;
			}
		}
	}
	
	return false;
};

mexui.util.isMonthIdOrName = function(text)
{
	var text2 = text;
	if(text2.length == 2 && text2.substr(0, 1) == '0')
		text2 = text2.substr(1);
	
	if(mexui.util.isPositiveInt(text2))
	{
		var _int = parseInt(text2);
		if(_int >= 1 && _int <= 12)
			return true;
	}
	
	return mexui.util.isMonthName(text);
};

mexui.util.isWeekDayId = function(text)
{
	var text2 = text;
	if(text2.length == 2 && text2.substr(0, 1) == '0')
		text2 = text2.substr(1);
	
	if(mexui.util.isPositiveInt(text2))
	{
		var _int = parseInt(text2);
		if(_int >= 1 && _int <= 7)
			return true;
	}
	
	return false;
};

mexui.util.isWeekDayIdOrName = function(text)
{
	var text2 = text;
	if(text2.length == 2 && text2.substr(0, 1) == '0')
		text2 = text2.substr(1);
	
	if(mexui.util.isPositiveInt(text2))
	{
		var _int = parseInt(text2);
		if(_int >= 1 && _int <= 7)
			return true;
	}
	
	return mexui.util.isWeekDayName(text);
};

mexui.util.expand2DigitYear = function(year, twoDigitYearCapOffset)
{
	var currentFullYear = new Date().getFullYear();
	var currentTwoDigitYearPlusCapOffset = parseInt((currentFullYear+'').substr(2, 2)) + twoDigitYearCapOffset;
	if(year <= currentTwoDigitYearPlusCapOffset)
		year += currentFullYear - (currentFullYear % 100);
	else
		year += (currentFullYear - (currentFullYear % 100)) - 100;
	return year;
};

mexui.util.isYear = function(text, minYear, maxYear, twoDigitYearCapOffset)
{
	var _int = parseInt(text);
	
	if(isNaN(_int))
		return false;
	
	if(_int >= 0 && _int <= 99)
		_int = mexui.util.expand2DigitYear(_int, twoDigitYearCapOffset);
	
	if(_int < minYear || _int > maxYear)
		return false;
	
	return true;
};