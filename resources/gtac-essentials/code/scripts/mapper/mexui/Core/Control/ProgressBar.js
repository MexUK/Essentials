mexui.util.createControlConstructor('ProgressBar', false, function(window, x, y, w, h, text, styles)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('ProgressBar', styles));
	
	this.text				= text;
	
	this.progress			= 0.0;
});

// default styles
mexui.util.linkBaseControlStyles('ProgressBar', {
	innerBar:
	{
		backgroundColour:	toColour(0, 255, 0, 255),
		
		hover:
		{
			backgroundColour:	toColour(80, 255, 0, 255)
		}
	}
});

// render
mexui.Control.ProgressBar.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	var innerBarSize = new Vec2(this.size.x * this.progress, this.size.y);
	mexui.native.drawRectangle(pos, innerBarSize, this.getStyles('innerBar'));
	
	if(this.text != '')
		mexui.native.drawText(pos, this.size, this.text, this.getStyles('main'));
};