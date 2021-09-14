mexui.util.createControlConstructor('Letters', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Letters', styles), callback, false, true);
});
mexui.util.extend(mexui.Control.Letters, mexui.Control.TextInput);

// model
mexui.Control.Letters.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isLetter(character);
};