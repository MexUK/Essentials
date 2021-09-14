mexui.util.createControlConstructor('Grid', true, function(window, x, y, w, h, styles)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Grid', styles));
	mexui.Entity.ControlWithEntries.call(this, false, false, new Vec2(0, 25), new Vec2(this.size.x, 25), new Vec2(0, -25));
});

// default styles
mexui.util.linkBaseControlStyles('Grid', {
	column:
	{
		lineColour:			toColour(0, 0, 0, 255)
	},
	header:
	{
		backgroundColour:	toColour(255, 255, 255, 255),
		textColour:			toColour(0, 0, 0, 255)
	},
	cell:
	{
		backgroundColour:	toColour(255, 255, 255, 255),
		textColour:			toColour(0, 0, 0, 255)
	},
	row:
	{
		lineColour:			toColour(0, 0, 0, 255)
	}
});

// render
mexui.Control.Grid.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	var startX = pos.x;
	var maxColumnHeight = 0;
	for(var i in this.axis.x.entries)
	{
		var column = this.axis.x.entries[i];
		
		mexui.native.drawText(new Vec2(startX, pos.y), new Vec2(column.width, column.height), column.text, this.getStyles('header'));
		
		startX += column.width;
		mexui.native.drawAALine(new Vec2(startX, pos.y), new Vec2(startX, pos.y + this.size.y), this.getStyles('column'));
		
		if(column.height > maxColumnHeight)
		{
			maxColumnHeight = column.height;
		}
	}
	
	var startY = pos.y + maxColumnHeight;
	mexui.native.drawAALine(new Vec2(pos.x, startY), new Vec2(pos.x + this.size.x, startY), this.getStyles('row'));
	
	for(var i=this.axis.y.getEntryStartIndex(),j=this.axis.y.getEntryEndIndex(); i<j; i++)
	{
		var row = this.axis.y.entries[i];
		if(!row)
			break;
		
		startX = pos.x;
		for(var i2 in row.cells)
		{
			var column = this.axis.x.entries[i2];
			var cell = row.cells[i2];
			var cellText = cell.text;
			
			var styles = this.getEntryStyles([[cell,'main'], [row,'main'], [this,'row'], [this,'cell']]);
			
			mexui.native.drawRectangle(new Vec2(startX, startY), new Vec2(column.width, column.height), styles);
			mexui.native.drawText(new Vec2(startX, startY), new Vec2(column.width, column.height), cellText, styles);
			
			startX += column.width;
		}
		
		startY += row.rowHeight;
		mexui.native.drawAALine(new Vec2(pos.x, startY), new Vec2(pos.x + this.size.x, startY), this.getStyles('row'));
	}
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

// model
mexui.Control.Grid.prototype.column = function(text, width, height)
{
	var entry = new mexui.Entry.GridColumn(this, text, width, height);
	this.axis.x.addEntry(entry);
	return entry;
};

mexui.Control.Grid.prototype.row = function(cellsData, styles)
{
	var cells = [];
	for(var i in cellsData)
	{
		if(cellsData[i] instanceof mexui.Component.Entry)
		{
			cells[i] = cellsData[i];
		}
		else
		{
			cells[i] = new mexui.Component.Entry(this, 1, cellsData[i] + '');
		}
	}
	
	var entry = new mexui.Entry.GridRow(this, cells, styles);
	this.axis.y.addEntry(entry);
	return entry;
};

mexui.Control.Grid.prototype.cell = function(text, styles)
{
	var entry = new mexui.Component.Entry(this, 0, text, styles);
	return entry;
};

mexui.Control.Grid.prototype.getAllEntriesLength = function(axisIndex)
{
	if(axisIndex == 0)
	{
		return 0;
	}
	else
	{
		return this.axis.y.getAllEntriesLength2();
	}
};

