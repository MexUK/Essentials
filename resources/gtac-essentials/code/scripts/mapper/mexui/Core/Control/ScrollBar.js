mexui.util.createControlConstructor('ScrollBar', false, function(window, x, y, w, h, isVertical, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('ScrollBar', styles), callback);
	
	this.isVertical			= isVertical;
	this.axisIndex			= isVertical ? 1 : 0;
	this.otherAxisIndex		= isVertical ? 0 : 1;
	
	this.barHigherLength	= 50;
	this.scrolledRatio		= 0.0;
	this.isScrolling		= false;
});

// default styles
mexui.util.linkBaseControlStyles('ScrollBar', {
	main:
	{
		backgroundColour:	toColour(0, 0, 0, 190),
		
		hover:
		{
			backgroundColour:	toColour(0, 0, 0, 150)
		}
	},
	innerBar:
	{
		backgroundColour:	toColour(79, 161, 246, 190),
		
		hover:
		{
			backgroundColour:	toColour(79, 161, 246, 150)
		}
	}
});

// input
mexui.Control.ScrollBar.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		if(mexui.util.isCursorInRectangle(this.getInnerBarPosition(), this.getInnerBarSize()))
		{
			e.used = true;
			this.isScrolling = true;
		}
		else if(this.isCursorOverControl())
		{
			e.used = true;
			this.scrolledRatio += this.getScrolledRatioOuterBarClickIncrease();
			this.clampScrolledRatio();
		}
	}
};

mexui.Control.ScrollBar.prototype.onMouseUp = function(e)
{
	if(e.button == 0 && this.isScrolling)
	{
		this.isScrolling = false;
		e.used = true;
	}
};

mexui.Control.ScrollBar.prototype.onMouseMove = function(e, offset)
{
	if(this.isScrolling)
	{
		this.scrolledRatio += offset.y * 0.002;
		this.clampScrolledRatio();
		e.used = true;
	}
	
	if(!e.used)
		mexui.Component.Control.prototype.onMouseMove.call(this, e, offset);
};

mexui.Control.ScrollBar.prototype.onMouseWheel = function(e, offset)
{
	this.scrolledRatio -= offset.y * 0.12;
	this.clampScrolledRatio();
};

// render
mexui.Control.ScrollBar.prototype.renderAfter = function()
{
	mexui.native.drawRectangle(this.getScreenPosition(), this.size, this.getStyles('main'));
	mexui.native.drawRectangle(this.getInnerBarPosition(), this.getInnerBarSize(), this.getStyles('innerBar'));
};

// model
mexui.Control.ScrollBar.prototype.clampScrolledRatio = function()
{
	if(this.scrolledRatio < 0.0)
		this.scrolledRatio = 0.0;
	else if(this.scrolledRatio > 1.0)
		this.scrolledRatio = 1.0;
};

mexui.Control.ScrollBar.prototype.getInnerBarPosition = function()
{
	var screenPos = this.getScreenPosition();
	var pos = new Vec2(screenPos.x, screenPos.y);
	
	var minPos = pos[this.axisIndex] + 1;
	var maxPos = pos[this.axisIndex] + this.size[this.axisIndex] - 2;
	pos[this.axisIndex] = minPos + (this.scrolledRatio * (maxPos - minPos - this.barHigherLength));
	pos[this.otherAxisIndex] += 1;
	return pos;
};

mexui.Control.ScrollBar.prototype.getInnerBarSize = function()
{
	var size = new Vec2(this.size.x, this.size.y);
	size[this.axisIndex] = this.barHigherLength;
	size[this.otherAxisIndex] -= 2;
	return size;
};

mexui.Control.ScrollBar.prototype.getScrolledRatioOuterBarClickIncrease = function()
{
	var direction = gui.cursorPosition.y < this.getInnerBarPosition().y ? -1.0 : 1.0;
	return direction * 0.05;
};