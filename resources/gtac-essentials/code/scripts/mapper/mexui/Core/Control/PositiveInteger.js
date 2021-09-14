mexui.util.createControlConstructor('PositiveInteger', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('PositiveInteger', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.PositiveInteger, mexui.Control.TextInput);

// model
mexui.Control.PositiveInteger.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character);
};

mexui.Control.PositiveInteger.prototype.validateValueCallback = function(e)
{
	return mexui.util.isPositiveInt(this.getText());
};