mexui.util.createControlConstructor('Digits', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Digits', styles), callback, false, true);
});
mexui.util.extend(mexui.Control.Digits, mexui.Control.TextInput);

// model
mexui.Control.Digits.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isDigit(character);
};