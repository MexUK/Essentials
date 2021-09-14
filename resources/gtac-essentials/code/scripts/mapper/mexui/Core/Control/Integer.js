mexui.util.createControlConstructor('Integer', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Integer', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Integer, mexui.Control.TextInput);

// model
mexui.Control.Integer.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isIntChar(character);
};

mexui.Control.Integer.prototype.validateValueCallback = function(e)
{
	return mexui.util.isInt(this.getText());
};