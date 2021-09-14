mexui.util.createControlConstructor('Rectangle', false, function(window, x, y, w, h, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Rectangle', styles), callback);
});

// default styles
mexui.util.linkBaseControlStyles('Rectangle', {});

// input
mexui.Control.Rectangle.prototype.onMouseDown = function(e)
{
	if(this.isCursorOverControl())
	{
		this.checkToCallCallback();
	}
};

// render
mexui.Control.Rectangle.prototype.render = function()
{
	var pos = this.getScreenPosition();
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
};