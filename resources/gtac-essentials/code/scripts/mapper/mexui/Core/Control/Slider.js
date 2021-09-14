mexui.util.createControlConstructor('Slider', false, function(window, x, y, w, h, isVertical, text, minText, maxText, styles, callback)
{
	isVertical = isVertical === undefined ? false : isVertical;
	text = text === undefined ? '' : text;
	minText = minText === undefined ? '' : minText;
	maxText = maxText === undefined ? '' : maxText;
	
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Slider', styles), callback);
	
	this.isVertical			= isVertical;
	this.text				= text;
	this.minText			= minText;
	this.maxText			= maxText;
	
	this.progress			= 0.0;
	this.axisIndex			= isVertical ? 1 : 0;
	this.innerBarSize		= new Vec2(30, 25);
});

// default styles
mexui.util.linkBaseControlStyles('Slider', {
	innerBar:
	{
		backgroundColour:	toColour(0, 255, 0, 255)
	},
	minText:
	{
		textColour:			toColour(0, 0, 0, 255)
	},
	maxText:
	{
		textColour:			toColour(0, 0, 0, 255)
	}
});

// input
mexui.Control.Slider.prototype.onMouseDown = function(e)
{
	if(e.button == 0 && this.isCursorOverInnerBar())
	{
		this.sliding = true;
		e.used = true;
	}
};

mexui.Control.Slider.prototype.onMouseUp = function(e)
{
	if(e.button == 0 && this.sliding)
	{
		this.sliding = false;
		this.checkToCallCallback();
		e.used = true;
	}
};

mexui.Control.Slider.prototype.onMouseMove = function(e, offset)
{
	if(!this.sliding)
		return false;
	
	this.progress += this.getProgressIncreaseByPixels(offset);
	this.clampProgress();
	e.used = true;
};

// render
mexui.Control.Slider.prototype.render = function()
{
	var pos = this.getScreenPosition();
	var pos2 = new Vec2(pos.x, pos.y);
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	mexui.native.drawRectangle(this.getInnerBarPosition(), this.innerBarSize, this.getStyles('innerBar'));
	
	pos.y += this.size.y;
	mexui.native.drawText(pos, this.size, this.minText, this.getStyles('minText'));
	
	var offset = (this.size.x - mexui.native.getTextWidth(this.text, this.getStyles('main'))) / 2;
	pos.x += offset;
	mexui.native.drawText(pos, this.size, this.text, this.getStyles('main'));
	pos.x -= offset;
	
	pos.x += this.size.x - mexui.native.getTextWidth(this.maxText, this.getStyles('maxText'));
	mexui.native.drawText(pos, this.size, this.maxText, this.getStyles('maxText'));
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos2,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

// model
mexui.Control.Slider.prototype.isCursorOverInnerBar = function()
{
	return mexui.util.isCursorInRectangle(this.getInnerBarPosition(), this.innerBarSize);
};

mexui.Control.Slider.prototype.getInnerBarPosition = function()
{
	var pos = this.getScreenPosition();
	pos[this.axisIndex] = mexui.util.interpolateScalar(pos.x, (pos.x + this.size.x) - this.innerBarSize.x, this.progress);
	pos.y -= 3;
	return new Vec2(pos.x, pos.y);
};

mexui.Control.Slider.prototype.getProgressIncreaseByPixels = function(offset)
{
	return offset.x / this.size.x;
};

mexui.Control.Slider.prototype.clampProgress = function()
{
	if(this.progress < 0.0)
		this.progress = 0.0;
	else if(this.progress > 1.0)
		this.progress = 1.0;
};

