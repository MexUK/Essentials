mexui.util.createControlConstructor('DropDown', true, function(window, x, y, w, h, text, styles, callback)
{
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('DropDown', styles), callback);
	mexui.Entity.ControlWithEntries.call(this, true, true, new Vec2(0, h), new Vec2(w + 120, 25));
	
	this.axis.y.entriesShown	= false;
	
	this.text					= text;
	
	this.arrowShown				= true;
	this.selectedEntryIndex		= -1;
	this.hoveredEntryIndex		= -1;
});

// default styles
mexui.util.linkBaseControlStyles('DropDown', {
	item:
	{
		backgroundColour:	toColour(255, 255, 255, 255),
		textColour:			toColour(0, 0, 0, 255),
		
		hover:
		{
			backgroundColour:	toColour(80, 80, 80, 255),
			textColour:			toColour(0, 0, 0, 255)
		}
	}
});

// input
mexui.Control.DropDown.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		if(this.axis.y.entries.length == 0)
			return;
		
		var hitButton = this.isCursorOverControl();
		if(hitButton)
		{
			e.used = true;
			this.setListShown(!this.axis.y.entriesShown);
		}
		else if(this.isListShown())
		{
			var selectedEntryIndex = this.axis.y.getEntryIndexByCursor();
			if(selectedEntryIndex != null)
			{
				this.selectEntryByIndex(selectedEntryIndex);
				e.used = true;
			}
		}
	}
	
	if(!e.used)
		mexui.Entity.ControlWithEntries.prototype.onMouseDown.call(this, e);
};

mexui.Control.DropDown.prototype.onKeyDown = function(e, key, mods)
{
	if(this.isFocused())
	{
		if(key == SDLK_RETURN || key == SDLK_RETURN2 || key == SDLK_KP_ENTER || key == SDLK_SPACE)
		{
			var selectedEntryIndex = this.axis.y.getEntryIndexByCursor();
			if(selectedEntryIndex == null)
			{
				this.setListShown(!this.isListShown());
				e.used = true;
			}
			else
			{
				this.selectEntryByIndex(selectedEntryIndex);
				e.used = true;
			}
		}
	}
};

// render
mexui.Control.DropDown.prototype.render = function()
{
	var pos = this.getScreenPosition();
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	var text = this.selectedEntryIndex == -1 ? this.text : this.axis.y.entries[this.selectedEntryIndex].text;
	mexui.native.drawText(pos, this.size, text, this.getStyles('main'));
	
	if(this.arrowShown)
	{
		var pos2 = new Vec2(pos.x + this.size.x - (25 + 3), pos.y + 0);
		mexui.native.drawImage(pos2, new Vec2(25, 25), mexui.images.downArrow, this.getStyles('main'));
	}
	
	mexui.Entity.ControlWithEntries.prototype.render.call(this);
	
	if(this.isFocused())
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
};

mexui.Control.DropDown.prototype.renderAfter = function()
{
	if(this.axis.y.entriesShown)
	{
		var pos = this.getScreenPosition();
		var pos2 = new Vec2(pos.x, pos.y);
		
		pos.x += this.entriesPositionOffset.x;
		pos.y += this.entriesPositionOffset.y;
		
		pos2.x += this.entriesPositionOffset.x;
		pos2.y += this.entriesPositionOffset.y;
		
		for(var i=this.axis.y.getEntryStartIndex(),j=this.axis.y.getEntryEndIndex(); i<j; i++)
		{
			var item = this.axis.y.entries[i];
			if(!item)
				break;
			
			//this.hovered = i == this.axis.y.hoveredEntryIndex;
			
			mexui.native.drawRectangle(pos, this.entrySize, this.getStyles('item'));
			mexui.native.drawText(pos, this.entrySize, item.text, this.getStyles('item'));
			
			pos.y += this.entrySize.y;
		}
		
		if(this.isFocused())
			mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos2,new Vec2(2,2)), mexui.util.addVec2(new Vec2(this.entrySize.x,this.axis.y.getDisplayedEntriesLength()),new Vec2(3,3)), this.getStyles('focused'));
	}
	
	mexui.Entity.ControlWithEntries.prototype.renderAfter.call(this);
};

// model
mexui.Control.DropDown.prototype.item = function(text)
{
	var entry = new mexui.Entry.DropDownItem(this, text);
	this.axis.y.addEntry(entry);
	return entry;
};

mexui.Control.DropDown.prototype.setListShown = function(shown)
{
	this.axis.y.entriesShown = shown;
	this.axis.y.setScrollBarShown(shown);
};

mexui.Control.DropDown.prototype.isListShown = function()
{
	return this.axis.y.entriesShown;
};

mexui.Control.DropDown.prototype.selectEntryByIndex = function(entryIndex)
{
	this.selectedEntryIndex = entryIndex;
	this.checkToCallCallback();
	this.setListShown(false);
};