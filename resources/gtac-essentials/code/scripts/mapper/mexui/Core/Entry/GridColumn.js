mexui.Entry.GridColumn = function(grid, text, width, height)
{
	mexui.Component.Entry.call(this, grid, 0);
	
	this.text			= text || 'Column';
	this.width			= width || 100;
	this.height			= height || 25;
};
mexui.util.extend(mexui.Entry.GridColumn, mexui.Component.Entry);