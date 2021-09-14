mexui.util.createControlConstructor('Letter', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Letter', styles), callback, true, false);
});
mexui.util.extend(mexui.Control.Letter, mexui.Control.TextInput);

// model
mexui.Control.Letter.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isLetter(character);
};