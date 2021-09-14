mexui.util.createControlConstructor('Text', false, function(window, x, y, w, h, text, styles)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Text', styles));
	
	this.text				= text;
});

// default styles
mexui.util.linkBaseControlStyles('Text', {});

// render
mexui.Control.Text.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawText(pos, this.size, this.text, this.getStyles('main'));
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};