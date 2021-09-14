mexui.Entity.Component = function(moveable)
{
	this.moveable		= moveable;
	
	this.moving			= false;
};
mexui.util.extend(mexui.Entity.Component, mexui.Entity.StyleableEntity);

// input
mexui.Entity.Component.prototype.onMouseDown = function(e)
{
	if(e.button == 0 && this.moveable && this.isCursorOverComponent())
	{
		this.moving = true;
		e.used = true;
	}
};

mexui.Entity.Component.prototype.onMouseUp = function(e)
{
	if(e.button == 0 && this.moving)
	{
		this.moving = false;
		e.used = true;
	}
};

mexui.Entity.Component.prototype.onMouseMove = function(e, offset)
{
	if(this.moving)
	{
		this.position = new Vec2(this.position.x + offset.x, this.position.y + offset.y);
		e.used = true;
	}
};

// model
mexui.Entity.Component.prototype.isCursorOverComponent = function()
{
	return mexui.util.isCursorInRectangle(this.getScreenPosition(), this.size);
};