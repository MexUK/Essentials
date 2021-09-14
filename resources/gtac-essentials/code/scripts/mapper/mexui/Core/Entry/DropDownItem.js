mexui.Entry.DropDownItem = function(dropDown, text)
{
	mexui.Component.Entry.call(this, dropDown, 1);
	
	this.text				= text;
};
mexui.util.extend(mexui.Entry.DropDownItem, mexui.Component.Entry);