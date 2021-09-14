mexui.util.createControlConstructor('Time', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Time', styles), callback, false, false);
	
	this.hour					= 0;
	this.minute					= 0;
	this.second					= 0;
	
	this.inputShown				= false;
	this.valueBoxSize			= new Vec2(50, 30);
	this.arrowBoxSize			= new Vec2(25, 22);
});
mexui.util.extend(mexui.Control.Time, mexui.Control.TextInput);

// static
mexui.Control.Time.units = ['hour', 'minute', 'second'];

// default styles
mexui.util.linkBaseControlStyles('Time', {
	arrow:
	{
		backgroundColour:	toColour(90, 90, 80, 230),
		textColour:			toColour(0, 0, 0, 255)
	}
});

// input
mexui.Control.Time.prototype.onMouseDown = function(e)
{
	if(this.inputShown)
	{
		var arrowIndex = this.getArrowIndexByCursor();
		if(arrowIndex !== false)
		{
			var propIndex = (Math.ceil((arrowIndex + 1) / 2)) - 1;
			var propName = mexui.Control.Time.units[propIndex];
			var isIncrease = (arrowIndex % 2) == 1;
			
			if(isIncrease)
				this[propName]++;
			else
				this[propName]--;
			
			this[propName] %= propIndex == 0 ? 24 : 60;
			if(this[propName] == -1)
				this[propName] = propIndex == 0 ? 23 : 59;
			
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
mexui.Control.Time.prototype.renderAfter = function()
{
	if(!this.inputShown)
		return;
	
	var screenPos = this.getScreenPosition();
	
	var pos = new Vec2(screenPos.x, screenPos.y);
	for(var i=0; i<3; i++)
	{
		mexui.native.drawRectangle(pos, this.valueBoxSize, this.getStyles('main'));
		mexui.native.drawText(pos, this.valueBoxSize, this[mexui.Control.Time.units[i]], this.getStyles('main'));
		
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
mexui.Control.Time.prototype.generateText = function()
{
	this.setText((this.hour < 10 ? '0'+this.hour : this.hour)
			+':'+(this.minute < 10 ? '0'+this.minute : this.minute)
			+':'+(this.second < 10 ? '0'+this.second : this.second));
};

mexui.Control.Time.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character) || character == ':';
};

mexui.Control.Time.prototype.validateValueCallback = function(e)
{
	var parts = this.getText().split(':');
	
	if(parts.length != 3)
		return false;
	
	for(var i in parts)
	{
		var partAsStr = parts[i];
		if(partAsStr === '')
			return false;
		
		var part = parseInt(partAsStr);
		
		if(partAsStr.length == 2 && partAsStr.substr(0, 1) == '0')
			partAsStr = partAsStr.substr(1);
		
		if(!mexui.util.isPositiveInt(partAsStr))
			return false;
		
		if(part < 0)
			return false;
		
		if(part > (i == 0 ? 23 : 59))
			return false;
	}
	
	return true;
};

mexui.Control.Time.prototype.getArrowIndexByCursor = function()
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