mexui.util.createControlConstructor('Number', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Number', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Number, mexui.Control.TextInput);

// model
mexui.Control.Number.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isFloatChar(character);
};

mexui.Control.Number.prototype.validateValueCallback = function(e)
{
	return mexui.util.isFloat(this.getText());
};