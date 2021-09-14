mexui.Component.Entry = function(control, axisIndex, text, styles)
{
	mexui.Entity.Component.call(this, false);
	mexui.Entity.StyleableEntity.call(this, this.linkComponentStyles('Entry', styles));
	
	this.control			= control;
	this.axisIndex			= axisIndex;
	this.text				= text;
};
mexui.util.extend(mexui.Component.Entry, mexui.Entity.Component);

// default styles
mexui.Component.Entry.defaultStyles = mexui.util.linkStyles(mexui.Entity.StyleableEntity.defaultStyles, {});

// model
mexui.Component.Entry.prototype.getEntryIndex = function()
{
	return this.control.axis[this.getAxisKey()].entries.indexOf(this);
};

mexui.Component.Entry.prototype.getAxisKey = function()
{
	return this.axisIndex == 0 ? 'x' : 'y';
};

// api
mexui.Component.Entry.prototype.remove = function()
{
	this.control.axis[this.getAxisKey()].entries.splice(this.getEntryIndex(), 1);
	this.control.checkToShowScrollBars();
};

