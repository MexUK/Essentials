mexui.util.createControlConstructor('TabPanel', true, function(window, x, y, w, h, styles)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('TabPanel', styles));
	mexui.Entity.ControlWithEntries.call(this, false, false);
	
	this.activeTabIndex		= 0;
});

// default styles
mexui.util.linkBaseControlStyles('TabPanel', {
	tab:
	{
		backgroundColour:	toColour(240, 20, 20, 200),
		borderColour:		toColour(120, 20, 20, 225),
		textColour:			toColour(0, 0, 0, 255),
		
		hover:
		{
			backgroundColour:	toColour(240, 20, 20, 150),
			borderColour:		toColour(120, 20, 20, 120),
			textColour:			toColour(0, 0, 0, 255)
		}
	}
});

// input
mexui.Control.TabPanel.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		var pos = this.getScreenPosition();
		
		var tabX = pos.x;
		for(var i in this.axis.x.entries)
		{
			var tab = this.axis.x.entries[i];
			
			var tabPos = new Vec2(tabX, pos.y);
			var tabSize = new Vec2(mexui.native.getTextWidth(tab.text, this.getStyles('tab')) + 10, 25);
			
			if(mexui.util.isCursorInRectangle(tabPos, tabSize))
			{
				tab.setActive();
				break;
			}
			
			tabX += tabSize.x;
		}
		
		/*
		var tab = this.axis.x.getEntryByCursor();
		if(tab)
			tab.setActive();
		*/
	}
};

// render
mexui.Control.TabPanel.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	var tabX = pos.x;
	for(var i in this.axis.x.entries)
	{
		var tab = this.axis.x.entries[i];
		
		var tabPos = new Vec2(tabX, pos.y);
		var tabSize = new Vec2(mexui.native.getTextWidth(tab.text, this.getStyles('tab')) + 10, 25);
		mexui.native.drawRectangle(tabPos, tabSize, this.getStyles('tab'));
		mexui.native.drawText(tabPos, tabSize, tab.text, this.getStyles('tab'));
		
		tabX += tabSize.x;
	}
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

// model
mexui.Control.TabPanel.prototype.tab = function(text)
{
	var entry = new mexui.Entry.Tab(this, text);
	this.axis.x.addEntry(entry);
	return entry;
};