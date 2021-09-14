mexui.Entity.ControlWithEntries = function(entriesOutsideControl, manualScrollBar, entriesPositionOffset, entrySize, entriesSizeOffset)
{
	this.entriesOutsideControl	= entriesOutsideControl;
	this.entriesPositionOffset	= entriesPositionOffset	|| new Vec2(0, 0);
	this.entrySize				= entrySize				|| new Vec2(this.size.x, 25);
	this.entriesSizeOffset		= entriesSizeOffset		|| new Vec2(0, 0);
	
	this.axis					= {};
	this.axis.x					= new mexui.Entity.ControlAxis(this, false, manualScrollBar, entriesPositionOffset);
	this.axis.y					= new mexui.Entity.ControlAxis(this, true, manualScrollBar, entriesPositionOffset);
	
	this.axis.x.initScrollBar();
	this.axis.y.initScrollBar();
	
	this.checkToShowScrollBars();
};
mexui.util.extend(mexui.Entity.ControlWithEntries, mexui.Component.Control);

// input
mexui.Entity.ControlWithEntries.prototype.onMouseDown = function(e)
{
	this.triggerEvent('onMouseDown', e);
};

mexui.Entity.ControlWithEntries.prototype.onMouseUp = function(e)
{
	this.triggerEvent('onMouseUp', e);
};

mexui.Entity.ControlWithEntries.prototype.onMouseMove = function(e, offset)
{
	for(var k in this.axis)
	{
		if(this.axis[k].entriesShown)
		{
			var hoveredEntryIndex = this.axis[k].getEntryIndexByCursor();
			if(hoveredEntryIndex == null)
			{
				this.axis[k].hoveredEntryIndex = -1;
			}
			else
			{
				e.used = true;
				this.axis[k].hoveredEntryIndex = hoveredEntryIndex;
				break;
			}
		}
	}
	
	if(!e.used)
		this.triggerEvent('onMouseMove', e, offset);
};

mexui.Entity.ControlWithEntries.prototype.onMouseWheel = function(e, data)
{
	this.triggerEvent('onMouseWheel', e, data);
};

// render
mexui.Entity.ControlWithEntries.prototype.renderAfter = function()
{
	this.triggerEvent('renderAfter');
};

// model
mexui.Entity.ControlWithEntries.prototype.triggerEvent = function(eventName, e, data)
{
	for(var k in this.axis)
	{
		if(this.axis[k].scrollBar.shown)
		{
			this.axis[k].scrollBar[eventName].call(this.axis[k].scrollBar, e, data);
			if(e && e.used)
				return;
		}
	}
	
	mexui.Component.Control.prototype[eventName].call(this, e, data);
};

mexui.Entity.ControlWithEntries.prototype.checkToShowScrollBars = function()
{
	this.axis.x.checkToShowScrollBar();
	this.axis.y.checkToShowScrollBar();
};

mexui.Entity.ControlWithEntries.prototype.setScrollBarsManual = function(manual)
{
	this.axis.x.setScrollBarManual(manual);
	this.axis.y.setScrollBarManual(manual);
};

mexui.Entity.ControlWithEntries.prototype.removeAllEntries = function()
{
	this.axis.x.removeAllEntries();
	this.axis.y.removeAllEntries();
};

