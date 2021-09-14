mexui.util.createControlConstructor('PositiveNumber', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('PositiveNumber', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.PositiveNumber, mexui.Control.TextInput);

// model
mexui.Control.PositiveNumber.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveFloatChar(character);
};

mexui.Control.PositiveNumber.prototype.validateValueCallback = function(e)
{
	return mexui.util.isPositiveFloat(this.getText());
};