mexui.Entity.ControlAxis = function(control, isVertical, manualScrollBar, entriesPositionOffset)
{
	this.control				= control;
	this.isVertical				= isVertical;
	this.manualScrollBar		= manualScrollBar;
	
	this.axisIndex				= isVertical ? 1 : 0;
	this.entriesShown			= true;
	this.entryCountShown		= 15;
	this.hoveredEntryIndex		= -1;
	this.entries				= [];
	this.scrollBar				= [];
};

// model

// scroll bar initialization
mexui.Entity.ControlAxis.prototype.initScrollBar = function()
{
	if(this.isVertical)
	{
		var pos					= mexui.util.addVec2(this.control.position, new Vec2(this.control.entrySize.x, this.control.entriesPositionOffset.y));
		this.scrollBar			= new mexui.Control.ScrollBar(this.control.window, pos.x, pos.y, 25, this.getDisplayedEntriesLength(), true, this.control.styles.scrollBar);
	}
	else
	{
		var pos					= mexui.util.addVec2(this.control.position, new Vec2(this.control.entriesPositionOffset.x, this.control.size.y));
		this.scrollBar			= new mexui.Control.ScrollBar(this.control.window, pos.x, pos.y, this.getDisplayedEntriesLength(), 25, false, this.control.styles.scrollBar);
	}
	
	if(this.manualScrollBar)
		this.scrollBar.shown = false;
};

// add/remove entries
mexui.Entity.ControlAxis.prototype.addEntry = function(entry)
{
	this.entries.push(entry);
	this.checkToShowScrollBar();
};

mexui.Entity.ControlAxis.prototype.removeAllEntries = function()
{
	this.entries = [];
	this.checkToShowScrollBar();
};

// fetch entry by position
mexui.Entity.ControlAxis.prototype.getEntryByCursor = function()
{
	return this.getEntryByPoint(gui.cursorPosition);
};

mexui.Entity.ControlAxis.prototype.getEntryIndexByCursor = function()
{
	return this.getEntryIndexByPoint(gui.cursorPosition);
};

mexui.Entity.ControlAxis.prototype.getEntryByPoint = function(point)
{
	var index = this.getEntryIndexByPoint(point);
	if(index == null)
		return null;
	return this.entries[index];
};

mexui.Entity.ControlAxis.prototype.getEntryIndexByPoint = function(point)
{
	var screenPos = this.control.getScreenPosition();
	if(this.axisIndex == 1)
	{
		if(point.x < screenPos.x || point.x > (screenPos.x + this.control.entrySize.x))
		{
			return null;
		}
		
		var pos = new Vec2(screenPos.x + this.control.entriesPositionOffset.x, screenPos.y + this.control.entriesPositionOffset.y);
		var index = Math.floor((point.y - pos.y) / this.control.entrySize[this.axisIndex]);
		index += this.getEntryStartIndex();
		
		if(index < 0 || index >= this.entries.length)
			return null;
		
		return index;
	}
	else
	{
		
	}
};

// entries sizing
mexui.Entity.ControlAxis.prototype.getOutsideEntriesLength = function()
{
	return this.control.entrySize[this.axisIndex] * this.entryCountShown;
};

mexui.Entity.ControlAxis.prototype.getAllEntriesLength = function()
{
	if(this.control.getAllEntriesLength)
		return this.control.getAllEntriesLength(this.axisIndex);
	else
		return this.getAllEntriesLength2();
};

mexui.Entity.ControlAxis.prototype.getAllEntriesLength2 = function()
{
	return this.entries.length * this.control.entrySize[this.axisIndex];
};

mexui.Entity.ControlAxis.prototype.getDisplayedEntriesLength = function()
{
	var sizeOffset = this.control.entriesSizeOffset[this.axisIndex];
	if(this.control.entriesOutsideControl)
		return this.getOutsideEntriesLength() + sizeOffset;
	else
		return this.control.size[this.axisIndex] + sizeOffset;
};

// entry scrolling
mexui.Entity.ControlAxis.prototype.setScrollBarManual = function(manual)
{
	this.manualScrollBar = manual;
	
	if(manual)
	{
		this.setScrollBarShown(false);
	}
};

mexui.Entity.ControlAxis.prototype.setScrollBarShown = function(shown)
{
	//if(axisIndex != this.axisIndex)
	//	shown = false;

	this.scrollBar.shown = shown;
	if(!shown)
		this.scrollBar.scrolledRatio = 0.0;
};

mexui.Entity.ControlAxis.prototype.shouldDisplayScrollBar = function()
{
	//if(axisIndex != this.axisIndex)
	//	return false;

	return this.getAllEntriesLength() > this.scrollBar.size[this.axisIndex];
};

mexui.Entity.ControlAxis.prototype.checkToShowScrollBar = function()
{
	if(this.manualScrollBar)
		return;
	
	this.setScrollBarShown(this.shouldDisplayScrollBar(), true);
};

mexui.Entity.ControlAxis.prototype.getScrolledOffset = function()
{
	if(this.axisIndex == 1)
	{
		if(!this.scrollBar.shown)
			return 0;
		
		return this.scrollBar.scrolledRatio * this.getScrollableLength();
	}
	else
	{
		return 0;
	}
};

mexui.Entity.ControlAxis.prototype.getScrolledOffsetFixedStart = function()
{
	var entryLength = this.control.entrySize[this.axisIndex];
	return Math.floor(this.getScrolledOffset() / entryLength) * entryLength;
};

mexui.Entity.ControlAxis.prototype.getScrollableLength = function()
{
	return this.getAllEntriesLength() - this.getOutsideEntriesLength();
};

// entry iteration
mexui.Entity.ControlAxis.prototype.getEntryStartIndex = function() // inclusive
{
	return Math.floor(this.getScrolledOffset() / this.control.entrySize[this.axisIndex]);
};

mexui.Entity.ControlAxis.prototype.getEntryEndIndex = function() // exclusive
{
	return this.getEntryStartIndex() + this.getDisplayedEntryCount();
};

mexui.Entity.ControlAxis.prototype.getDisplayedEntryCount = function()
{
	var displayedEntriesLength = this.getDisplayedEntriesLength();
	var displayedEntryCount = Math.floor(displayedEntriesLength / this.control.entrySize[this.axisIndex]);
	return this.entries.length < displayedEntryCount ? this.entries.length : displayedEntryCount;
};

