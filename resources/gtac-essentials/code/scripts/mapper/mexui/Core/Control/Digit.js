mexui.util.createControlConstructor('Digit', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Digit', styles), callback, true, false);
});
mexui.util.extend(mexui.Control.Digit, mexui.Control.TextInput);

// model
mexui.Control.Digit.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isDigit(character);
};