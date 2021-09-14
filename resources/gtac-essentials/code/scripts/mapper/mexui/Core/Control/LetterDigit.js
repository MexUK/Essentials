mexui.util.createControlConstructor('LetterDigit', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('LetterDigit', styles), callback, true, false);
});
mexui.util.extend(mexui.Control.LetterDigit, mexui.Control.TextInput);

// model
mexui.Control.LetterDigit.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isLetterOrDigit(character);
};