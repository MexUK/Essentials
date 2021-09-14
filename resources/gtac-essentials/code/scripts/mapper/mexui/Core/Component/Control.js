mexui.Component.Control = function(window, x, y, w, h, styles, callback)
{
	mexui.Entity.Component.call(this, false);
	mexui.Entity.StyleableEntity.call(this, this.linkComponentStyles('Control', styles));
	
	this.window		= window;
	this.position	= new Vec2(x, y);
	this.size		= new Vec2(w, h);
	this.callback	= callback;
	
	this.boundTo	= null;
};
mexui.util.extend(mexui.Component.Control, mexui.Entity.Component);

// default styles
//mexui.Component.Control.defaultStyles = {};
//mexui.Component.Control.defaultStyles.__proto__ = mexui.Entity.StyleableEntity.defaultStyles;

mexui.Component.Control.defaultStyles = mexui.util.linkStyles(mexui.Entity.StyleableEntity.defaultStyles, {});

// input
mexui.Component.Control.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		var hit = this.isCursorOverControl();
		if(hit)
		{
			e.used = true;
			e.clickedAControl = true;
			mexui.focusedControl = this;
		}
	}
};

mexui.Component.Control.prototype.onMouseUp = function(e)
{
};

mexui.Component.Control.prototype.onMouseMove = function(e, offset)
{
	if(this.isCursorOverControl())
	{
		if(!this.isHovered())
		{
			mexui.setHoveredComponent(this);
			this.onMouseEnter();
		}
		e.used = true;
	}
	else if(e.wasHovered)
	{
		mexui.clearHoveredComponent();
		this.onMouseExit();
	}
};

mexui.Component.Control.prototype.onMouseWheel = function(e, data)
{
};

mexui.Component.Control.prototype.onKeyDown = function(e, key, mods)
{
};

mexui.Component.Control.prototype.onCharacter = function(e, character)
{
};

// render
mexui.Component.Control.prototype.render = function()
{
};

mexui.Component.Control.prototype.renderAfter = function()
{
};

// model
mexui.Component.Control.prototype.checkToCallCallback = function()
{
	if(this.callback)
		this.callback.call(this);
};

mexui.Component.Control.prototype.getScreenPosition = function()
{
	var pos = mexui.util.addVec2(this.window.position, this.position);
	if(this.boundTo)
		pos = mexui.util.addVec2(pos, new Vec2(-this.boundTo.axis.x.getScrolledOffsetFixedStart(), -this.boundTo.axis.y.getScrolledOffsetFixedStart()));
	return pos;
};

mexui.Component.Control.prototype.isCursorOverControl = function()
{
	return mexui.util.isCursorInRectangle(this.getScreenPosition(), this.getSizeForInput ? this.getSizeForInput() : this.size);
};

mexui.Component.Control.prototype.isCursorOverItem = function()
{
	return this.isCursorOverControl();
};

mexui.Component.Control.prototype.isInsideBoundControl = function()
{
	if(this.boundTo instanceof mexui.Entity.ControlWithEntries)
		return this.isInsideBoundControlEntries();
	else
		return mexui.util.isRectangleInsideRectangle(this.getScreenPosition(), this.size, this.boundTo.getScreenPosition(), this.boundTo.size);
};

mexui.Component.Control.prototype.isInsideBoundControlEntries = function()
{
	var boundToControlPosition = mexui.util.addVec2(this.boundTo.getScreenPosition(), this.boundTo.entriesPositionOffset);
	var boundToControlSize = new Vec2(this.boundTo.size.x, this.boundTo.axis.y.getDisplayedEntriesLength());
	return mexui.util.isRectangleInsideRectangle(this.getScreenPosition(), this.size, boundToControlPosition, boundToControlSize);
};

// api
mexui.Component.Control.prototype.remove = function()
{
	this.window.controls.splice(this.window.controls.indexOf(this), 1);
};

mexui.Component.Control.prototype.bindTo = function(control)
{
	this.boundTo = control;
};

mexui.Component.Control.prototype.unbind = function()
{
	this.boundTo = null;
};

