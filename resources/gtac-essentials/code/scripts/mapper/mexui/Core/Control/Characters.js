mexui.util.createControlConstructor('Characters', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Characters', styles), callback, false, true);
});
mexui.util.extend(mexui.Control.Characters, mexui.Control.TextInput);

// model
mexui.Control.Characters.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isCharacterInOctetRange(character, 32, 126);
};