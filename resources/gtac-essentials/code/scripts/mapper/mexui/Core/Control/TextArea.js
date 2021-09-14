mexui.util.createControlConstructor('TextArea', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('TextArea', styles), callback, false, true);
	
	this.multiLine			= true;
});
mexui.util.extend(mexui.Control.TextArea, mexui.Control.TextInput);