mexui.util.createControlConstructor('Line', false, function(window, x, y, w, h, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Line', styles), callback);
});

// default styles
mexui.util.linkBaseControlStyles('Line', {});

// input
mexui.Control.Line.prototype.onMouseDown = function(e)
{
	if(this.isCursorOverControl())
	{
		this.checkToCallCallback();
	}
};

// render
mexui.Control.Line.prototype.render = function()
{
	var pos = this.getScreenPosition();
	mexui.native.drawAALine(pos, this.size, this.getStyles('main'));
};