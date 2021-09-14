mexui.util.createControlConstructor('WeekDay', false, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Control.TextInput.call(this, window, x, y, w, h, text, this.linkControlStyles('WeekDay', styles), callback, false, false);
});
mexui.util.extend(mexui.Control.WeekDay, mexui.Control.TextInput);

// model
mexui.Control.WeekDay.prototype.validateInputCallback = function(e, character)
{
	return mexui.util.isPositiveIntChar(character) || mexui.util.isLetter(character);
};

mexui.Control.WeekDay.prototype.validateValueCallback = function(e)
{
	return mexui.util.isWeekDayIdOrName(this.getText());
};