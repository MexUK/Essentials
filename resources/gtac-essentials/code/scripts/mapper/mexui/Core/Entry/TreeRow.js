mexui.Entry.TreeRow = function(tree, text)
{
	mexui.Component.Entry.call(this, tree, 1);
	
	this.open				= true;
	this.text				= text;
	this.rows				= [];
};
mexui.util.extend(mexui.Entry.TreeRow, mexui.Component.Entry);

// model
mexui.Entry.TreeRow.prototype.row = function(text)
{
	var entry = new mexui.Entry.TreeRow(this.control, text);
	this.rows.push(entry);
	return entry;
};