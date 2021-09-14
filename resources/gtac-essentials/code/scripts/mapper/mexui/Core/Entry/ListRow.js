mexui.Entry.ListRow = function(list, text)
{
	mexui.Component.Entry.call(this, list, 1);
	
	this.text				= text;
};
mexui.util.extend(mexui.Entry.ListRow, mexui.Component.Entry);