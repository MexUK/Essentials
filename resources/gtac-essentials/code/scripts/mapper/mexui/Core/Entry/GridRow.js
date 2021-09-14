mexui.Entry.GridRow = function(grid, cells, styles)
{
	mexui.Component.Entry.call(this, grid, 1);
	mexui.Entity.StyleableEntity.call(this, this.linkEntryStyles('GridRow', styles));
	
	this.cells			= cells;
	this.rowHeight		= 25;
};
mexui.util.extend(mexui.Entry.GridRow, mexui.Component.Entry);

// default styles
mexui.Entry.GridRow.defaultStyles = mexui.util.linkStyles(mexui.Entity.StyleableEntity.defaultStyles, {});

