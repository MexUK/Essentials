mexui.util.createControlConstructor('Minute', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Minute', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Minute, mexui.Control.TextInput);

// model
mexui.Control.Minute.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character);
};

mexui.Control.Minute.prototype.validateValueCallback = function(e)
{
	var _int = parseInt(this.getText());
	
	if(_int < 1 || _int > 59)
		return false;
	
	return true;
};