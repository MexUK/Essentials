mexui.util.createControlConstructor('Date', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Date', styles), callback, false, false);
	
	this.day					= 1;
	this.month					= 1;
	this.year					= 2019;
	
	this.inputShown				= false;
	this.valueBoxSize			= new Vec2(50, 30);
	this.arrowBoxSize			= new Vec2(25, 22);
	
	this.maxYearOffset			= 10;
	this.minYearCallback		= ()=>{ return 1900; };
	this.maxYearCallback		= ()=>{ return new Date().getFullYear() + this.maxYearOffset; }
	this.twoDigitYearCapOffset	= 10;
});
mexui.util.extend(mexui.Control.Date, mexui.Control.TextInput);

// static
mexui.Control.Date.units = ['day', 'month', 'year'];

// default styles
mexui.util.linkBaseControlStyles('Date', {
	arrow:
	{
		backgroundColour:	toColour(90, 90, 80, 230),
		textColour:			toColour(0, 0, 0, 255)
	}
});

// input
mexui.Control.Date.prototype.onMouseDown = function(e)
{
	if(this.inputShown)
	{
		var arrowIndex = this.getArrowIndexByCursor();
		if(arrowIndex !== false)
		{
			var propIndex = (Math.ceil((arrowIndex + 1) / 2)) - 1;
			var propName = mexui.Control.Date.units[propIndex];
			var isIncrease = (arrowIndex % 2) == 1;
			
			if(isIncrease)
				this[propName]++;
			else
				this[propName]--;
			
			if(this.day == 0)
				this.day = 31;
			else if(this.day == 32)
				this.day = 1;
			
			if(this.month == 0)
				this.month = 12;
			else if(this.month == 13)
				this.month = 1;
			
			var minYear = this.minYearCallback();
			var maxYear = this.maxYearCallback();
			if(this.year < minYear)
				this.year = minYear;
			else if(this.year > maxYear)
				this.year = maxYear;
			
			this.generateText();
			
			return;
		}
	}
	
	if(this.isCursorOverControl())
	{
		this.inputShown = !this.inputShown;
		e.used = true;
		return;
	}
	
	if(this.inputShown)
	{
		this.inputShown = false;
		e.used = true;
		return;
	}
};

// render
mexui.Control.Date.prototype.renderAfter = function()
{
	if(!this.inputShown)
		return;
	
	var screenPos = this.getScreenPosition();
	
	var pos = new Vec2(screenPos.x, screenPos.y);
	for(var i=0; i<3; i++)
	{
		mexui.native.drawRectangle(pos, this.valueBoxSize, this.getStyles('main'));
		mexui.native.drawText(pos, this.valueBoxSize, this[mexui.Control.Date.units[i]], this.getStyles('main'));
		
		pos.x += this.valueBoxSize.x;
	}
	
	pos = new Vec2(screenPos.x, screenPos.y);
	pos.y += this.valueBoxSize.y;
	for(var i=0; i<3; i++)
	{
		for(var i2=0; i2<2; i2++)
		{
			var text = (i2 % 2) == 0 ? '<' : '>';
			
			mexui.native.drawRectangle(pos, this.arrowBoxSize, this.getStyles('main'));
			mexui.native.drawText(pos, this.arrowBoxSize, text, this.getStyles('main'));
			
			pos.x += this.arrowBoxSize.x;
		}
	}
};

// model
mexui.Control.Date.prototype.generateText = function()
{
	this.setText((this.day < 10 ? '0'+this.day : this.day)
			+'/'+(this.month < 10 ? '0'+this.month : this.month)
			+'/'+(this.year < 10 ? '0'+this.year : this.year));
};

mexui.Control.Date.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character) || mexui.util.isLetter(character) || character == '/';
};

mexui.Control.Date.prototype.validateValueCallback = function(e)
{
	var parts = this.getText().split('/');
	
	if(parts.length != 3)
		return false;
	
	for(var i in parts)
	{
		var partAsStr = parts[i];
		if(partAsStr === '')
			return false;
		
		if(i == 0)
		{
			if(!mexui.util.isDayIdWithOptionalSuffix(partAsStr))
				return false;
		}
		else if(i == 1)
		{
			if(!mexui.util.isMonthIdOrName(partAsStr))
				return false;
		}
		else if(i == 2)
		{
			if(!mexui.util.isYear(partAsStr, this.minYearCallback(), this.maxYearCallback(), this.twoDigitYearCapOffset))
				return false;
		}
	}
	
	return true;
};

mexui.Control.Date.prototype.getArrowIndexByCursor = function()
{
	var cursorPos = gui.cursorPosition;
	
	var screenPos = this.getScreenPosition();
	var firstArrowStartPos = new Vec2(screenPos.x, screenPos.y + this.valueBoxSize.y);
	var lastArrowEndPos = new Vec2(screenPos.x + (this.arrowBoxSize.x * 6), screenPos.y + this.valueBoxSize.y + this.arrowBoxSize.y);
	
	if(cursorPos.x >= firstArrowStartPos.x && cursorPos.y >= firstArrowStartPos.y && cursorPos.x <= lastArrowEndPos.x && cursorPos.y <= lastArrowEndPos.y)
	{
		return Math.floor((cursorPos.x - firstArrowStartPos.x) / this.arrowBoxSize.x);
	}
	else
	{
		return false;
	}
};