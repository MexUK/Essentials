mexui.Entry.Tab = function(tabPanel, text)
{
	mexui.Component.Entry.call(this, tabPanel, 0);
	
	this.text				= text;
	this.controls			= [];
};
mexui.util.extend(mexui.Entry.Tab, mexui.Component.Entry);

// model
mexui.Entry.Tab.prototype._control = function(control)
{
	control.shown = this.control.activeTabIndex == this.getEntryIndex();
	this.controls.push(control);
};

mexui.Entry.Tab.prototype.setActive = function()
{
	for(var i in this.control.entries[this.control.activeTabIndex].controls)
		this.control.entries[this.control.activeTabIndex].controls[i].shown = false;
	
	this.control.activeTabIndex = this.getEntryIndex();
	
	for(var i in this.control.entries[this.control.activeTabIndex].controls)
		this.control.entries[this.control.activeTabIndex].controls[i].shown = true;
};