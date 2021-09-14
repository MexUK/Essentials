mexui.util.createControlConstructor('Day', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Day', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Day, mexui.Control.TextInput);

// model
mexui.Control.Day.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character) || mexui.util.isLetter(character);
};

mexui.Control.Day.prototype.validateValueCallback = function(e)
{
	return mexui.util.isDayIdWithOptionalSuffix(this.getText());
};