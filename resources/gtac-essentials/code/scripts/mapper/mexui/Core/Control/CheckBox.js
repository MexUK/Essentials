mexui.util.createControlConstructor('CheckBox', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('CheckBox', styles), callback);
	
	this.text				= text;
	
	this.checked			= false;
	this.textMarginLeft		= 5;
});

// default styles
mexui.util.linkBaseControlStyles('CheckBox', {
	innerBox:
	{
		backgroundColour:	toColour(0, 255, 0, 255)
	}
});

// input
mexui.Control.CheckBox.prototype.onMouseDown = function(e)
{
	if(e.button == 0 && this.isCursorOverControl())
	{
		e.used = true;
		this.toggleChecked();
	}
};

mexui.Control.CheckBox.prototype.onKeyDown = function(e, key, mods)
{
	if(this.isFocused())
	{
		if(key == SDLK_RETURN || key == SDLK_RETURN2 || key == SDLK_KP_ENTER || key == SDLK_SPACE)
		{
			e.used = true;
			this.toggleChecked();
		}
	}
};

// render
mexui.Control.CheckBox.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	if(this.checked)
		mexui.native.drawRectangle(mexui.util.addVec2(pos, new Vec2(1, 1)), new Vec2(this.size.x - 2, this.size.y - 2), this.getStyles('innerBox'));
	
	mexui.native.drawText(mexui.util.addVec2(pos, new Vec2(this.size.x + this.textMarginLeft, 2)), this.size, this.text, this.getStyles('main'));
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

// model
mexui.Control.CheckBox.prototype.getSizeForInput = function()
{
	var textWidth = mexui.native.getTextWidth(this.text, this.getStyles('main'));
	return new Vec2(this.size.x + this.textMarginLeft + textWidth, this.size.y);
};

mexui.Control.CheckBox.prototype.toggleChecked = function()
{
	this.checked = !this.checked;
	this.checkToCallCallback();
};