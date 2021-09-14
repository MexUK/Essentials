mexui.util.createControlConstructor('Week', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Week', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Week, mexui.Control.TextInput);

// model
mexui.Control.Week.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character);
};

mexui.Control.Week.prototype.validateValueCallback = function(e)
{
	var _int = parseInt(this.getText());
	
	if(_int < 1 || _int > 52)
		return false;
	
	return true;
};