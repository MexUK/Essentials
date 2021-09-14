mexui.util.createControlConstructor('Character', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('Character', styles), callback, true, false);
});
mexui.util.extend(mexui.Control.Character, mexui.Control.TextInput);

// model
mexui.Control.Character.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isCharacterInOctetRange(character, 32, 126);
};