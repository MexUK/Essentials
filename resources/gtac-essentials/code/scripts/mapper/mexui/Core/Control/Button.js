mexui.util.createControlConstructor('Button', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Button', styles), callback);
	
	this.text				= text;
});

// default styles
mexui.util.linkBaseControlStyles('Button', {});

// input
mexui.Control.Button.prototype.onMouseDown = function(e)
{
	if(e.button == 0 && this.isCursorOverControl())
	{
		e.used = true;
		this.checkToCallCallback();
	}
};

mexui.Control.Button.prototype.onKeyDown = function(e, key, mods)
{
	if(this.isFocused() && (key == SDLK_RETURN || key == SDLK_RETURN2 || key == SDLK_KP_ENTER || key == SDLK_SPACE))
	{
		e.used = true;
		this.checkToCallCallback();
	}
};

// render
mexui.Control.Button.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	mexui.native.drawText(pos, this.size, this.text, this.getStyles('main'));
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};