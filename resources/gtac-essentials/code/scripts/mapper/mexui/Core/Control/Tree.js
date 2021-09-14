mexui.util.createControlConstructor('Tree', true, function(window, x, y, w, h, styles)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('Tree', styles));
	mexui.Entity.ControlWithEntries.call(this, false, false);
	
	this.rowHeight					= 25;
	this.rowLevelIndentation		= 10;
	this.scrollMultiplier			= 10.0;
});

// default styles
mexui.util.linkBaseControlStyles('Tree', {
	row:
	{
		backgroundColour:	toColour(255, 255, 255, 255),
		textColour:			toColour(0, 0, 0, 255)
	},
	rowIcon:
	{
		textColour:			toColour(230, 130, 0, 190)
	},
	rowLine:
	{
		lineColour:			toColour(0, 0, 0, 150)
	}
});

// input
mexui.Control.Tree.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		var pos = this.getScreenPosition();
		pos.y -= this.axis.y.getScrolledOffset();
		
		this.testRowClick(e, this.axis.y.entries, pos);
	}
	
	if(!e.used)
		mexui.Entity.ControlWithEntries.prototype.onMouseDown.call(this, e);
};

// render
mexui.Control.Tree.prototype.render = function()
{
	var pos = this.getScreenPosition();
	pos.y -= this.axis.y.getScrolledOffset();
	
	this.renderRows(this.axis.y.entries, 0, pos);
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

mexui.Control.Tree.prototype.renderRows = function(rows, level, pos)
{
	for(var i in rows)
	{
		var row = rows[i];
		var shouldDraw = pos.y >= this.getScreenPosition().y && pos.y <= (this.getScreenPosition().y + this.size.y);
		
		if(shouldDraw)
		{
			if(row.rows.length > 0)
				mexui.native.drawText(new Vec2(pos.x - (this.rowLevelIndentation * 2), pos.y), new Vec2(this.size.x, this.rowHeight), row.open ? '-' : '+', this.getStyles('rowIcon'));
			
			mexui.native.drawRectangle(pos, new Vec2(this.size.x - (this.rowLevelIndentation * level), this.rowHeight), this.getStyles('row'));
			mexui.native.drawText(pos, new Vec2(this.size.x, this.rowHeight), row.text, this.getStyles('row'));
		}
		
		pos.y += this.rowHeight;
		
		if(shouldDraw)
		{
			mexui.native.drawAALine(pos, new Vec2(pos.x + this.size.x, pos.y), this.getStyles('rowLine'));
		}
		
		if(row.rows.length > 0 && row.open)
		{
			pos.x += this.rowLevelIndentation;
			this.renderRows(row.rows, level + 1, pos);
			pos.x -= this.rowLevelIndentation;
		}
	}
};

// model
mexui.Control.Tree.prototype.getAllEntriesLength = function(axisIndex)
{
	return this.getRowsLength(this.axis.y.entries);
};

mexui.Control.Tree.prototype.getRowsLength = function(rows)
{
	var length = rows.length * this.entrySize.y;
	for(var i in rows)
	{
		if(rows[i].open)
			length += this.getRowsLength(rows[i].rows);
	}
	return length;
};

mexui.Control.Tree.prototype.testRowClick = function(e, rows, pos)
{
	for(var i in rows)
	{
		var row = rows[i];
		
		var rowPos = new Vec2(pos.x - (this.rowLevelIndentation * 2), pos.y);
		var rowSize = new Vec2(this.size.x + (this.rowLevelIndentation * 2), this.rowHeight);
		if(mexui.util.isCursorInRectangle(rowPos, rowSize))
		{
			this.onClickRow(row);
			e.used = true;
			return;
		}
		
		pos.y += this.rowHeight;
		
		if(row.rows.length > 0 && row.open)
		{
			this.testRowClick(e, row.rows, pos);
			if(e.used)
				return;
		}
	}
};

mexui.Control.Tree.prototype.onClickRow = function(row)
{
	if(row.rows.length > 0)
	{
		//var scrollableLengthBefore = this.axis.y.getScrollableLength();
		
		row.open = !row.open;
		this.checkToShowScrollBars();
		
		/*
		if(this.scrollBars[1].shown)
		{
			var scrollableLengthAfter = this.axis.y.getScrollableLength();
			this.scrollBars[1].scrolledRatio += (scrollableLengthAfter - scrollableLengthBefore) / scrollableLengthAfter;
		}
		*/
	}
};

// api
mexui.Control.Tree.prototype.row = function(text)
{
	var entry = new mexui.Entry.TreeRow(this, text);
	this.axis.y.addEntry(entry);
	return entry;
};

