mexui.util.createControlConstructor('Password', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Password', styles), callback, false, true);
	
	this.masked				= true;
});
mexui.util.extend(mexui.Control.Password, mexui.Control.TextInput);