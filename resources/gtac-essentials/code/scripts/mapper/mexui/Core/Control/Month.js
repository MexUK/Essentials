mexui.util.createControlConstructor('Month', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Month', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.Month, mexui.Control.TextInput);

// model
mexui.Control.Month.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character) || mexui.util.isLetter(character);
};

mexui.Control.Month.prototype.validateValueCallback = function(e)
{
	return mexui.util.isMonthIdOrName(this.getText());
};