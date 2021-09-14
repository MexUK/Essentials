mexui.util.createControlConstructor('Hour', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Hour', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Hour, mexui.Control.TextInput);

// model
mexui.Control.Hour.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character);
};

mexui.Control.Hour.prototype.validateValueCallback = function(e)
{
	var _int = parseInt(this.getText());
	
	if(_int < 1 || _int > 23)
		return false;
	
	return true;
};