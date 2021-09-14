mexui.util.createControlConstructor('LettersDigits', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('LettersDigits', styles), callback, false, true);
});
mexui.util.extend(mexui.Control.LettersDigits, mexui.Control.TextInput);

// model
mexui.Control.LettersDigits.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isLetterOrDigit(character);
};