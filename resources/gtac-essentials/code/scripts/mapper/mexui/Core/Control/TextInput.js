mexui.util.createControlConstructor('TextInput', false, function(window, x, y, w, h, text, styles, callback, singleCharacter, multiLineSupported)
{
	text = text || '';
	if(singleCharacter)
		multiLineSupported = false;
	
	mexui.Component.Control.call(this, window, x, y, w, h, this.linkControlStyles('TextInput', styles), callback);
	
	this.lines				= text ? mexui.util.splitLines(text) : [''];
	
	this.caretPosition		= new Vec2(0, 0);
	this.multiLineSupported	= multiLineSupported === undefined ? true : multiLineSupported;
	this.multiLine			= this.multiLineSupported ? mexui.util.doesContainEOLChar(text) : false;
	this.masked				= false;
	this.singleCharacter	= singleCharacter === undefined ? false : singleCharacter;
	this.placeholder		= '';
	this.caretShownForBlink	= true;
	this.lineHeight			= 25;
	this.maxLength			= this.singleCharacter ? 1 : false;
	
	this.validValue			= true;
});

// default styles
mexui.util.linkBaseControlStyles('TextInput', {
	caret:
	{
		lineColour:			toColour(0, 0, 0, 255)
	},
	placeholder:
	{
		textColour:			toColour(100, 100, 100, 255)
	}
});

// input
mexui.Control.TextInput.prototype.onMouseDown = function(e)
{
	if(e.button == 0)
	{
		var hit = this.isCursorOverControl();
		if(hit)
		{
			this.caretPosition = this.getCaretPositionByCursor();
		}
	}
	
	mexui.Component.Control.prototype.onMouseDown.call(this, e);
};

mexui.Control.TextInput.prototype.onCharacter = function(e, character)
{
	if(mexui.focusedControl == this)
	{
		/*
		var isValid1 = this.callback ? this.callback(character) : true;
		if(!isValid1 && isValid1 !== undefined)
			return;
		*/
		
		var isValid2 = this.validateInputCallback ? this.validateInputCallback(e, character) : true;
		if(!isValid2)
			return;
		
		if(this.singleCharacter)
		{
			this.resetText();
			this.lines = [character];
			this.caretPosition.x = this.caretPosition.x < 2 ? this.caretPosition.x : 0;
		}
		else if(this.canAddCharacter())
		{
			this.lines[this.caretPosition.y] = this.getTextWithNewCharacter(character);
			this.caretPosition.x++;
		}
		
		this.checkToCallCallback();
		this.validateValue(e);
	}
};

mexui.Control.TextInput.prototype.onKeyDown = function(e, key, mods)
{
	if(mexui.focusedControl != this)
		return;
	
	var controlIsDown = (mods & KMOD_CTRL) == KMOD_CTRL;
	
	switch(key)
	{
		case SDLK_LEFT:
			if(this.caretPosition.x != 0)
			{
				this.caretPosition.x--;
			}
			else if(this.caretPosition.y != 0)
			{
				this.caretPosition.y--;
				this.caretPosition.x = this.getCaretLine().length;
			}
			break;
		case SDLK_RIGHT:
			if(this.caretPosition.x != this.getCaretLine().length)
			{
				this.caretPosition.x++;
			}
			else if(this.caretPosition.y != (this.lines.length - 1))
			{
				this.caretPosition.y++;
				this.caretPosition.x = 0;
			}
			break;
		case SDLK_HOME:
			if(controlIsDown)
			{
				this.caretPosition.y = 0;
				this.caretPosition.x = 0;
			}
			else
				this.caretPosition.x = 0;
			break;
		case SDLK_END:
			if(controlIsDown)
			{
				this.caretPosition.y = this.lines.length - 1;
				this.caretPosition.x = this.getCaretLine().length;
			}
			else
				this.caretPosition.x = this.getCaretLine().length;
			break;
		case SDLK_DELETE:
			if(this.caretPosition.x != this.getCaretLine().length)
			{
				this.deleteCharacter(this.caretPosition);
				this.checkToCallCallback();
			}
			else if(this.caretPosition.y != (this.lines.length - 1))
			{
				this.mergeLines(this.caretPosition.y);
				this.checkToCallCallback();
			}
			break;
		case SDLK_BACKSPACE:
			if(this.caretPosition.x != 0)
			{
				this.deleteCharacter(new Vec2(this.caretPosition.x - 1, this.caretPosition.y));
				this.caretPosition.x--;
				this.checkToCallCallback();
			}
			else if(this.caretPosition.y != 0)
			{
				this.caretPosition.y--;
				this.caretPosition.x = this.getCaretLine().length;
				this.mergeLines(this.caretPosition.y);
				this.checkToCallCallback();
			}
			break;
	}
	
	if(this.multiLine)
	{
		switch(key)
		{
			case SDLK_RETURN:
			case SDLK_KP_ENTER:
				if(this.canAddCharacter())
				{
					if(this.caretPosition.x == this.getCaretLine().length)
					{
						this.addLine(this.caretPosition.y + 1);
						this.caretPosition.y++;
						this.caretPosition.x = 0;
						this.checkToCallCallback();
					}
					else
					{
						this.splitLine(this.caretPosition.y);
						this.caretPosition.y++;
						this.caretPosition.x = 0;
						this.checkToCallCallback();
					}
				}
				break;
			case SDLK_UP:
				if(this.caretPosition.y != 0)
				{
					this.caretPosition.y--;
					if(this.caretPosition.x > this.getCaretLine().length)
						this.caretPosition.x = this.getCaretLine().length;
				}
				break;
			case SDLK_DOWN:
				if(this.caretPosition.y != (this.lines.length - 1))
				{
					this.caretPosition.y++;
					if(this.caretPosition.x > this.getCaretLine().length)
						this.caretPosition.x = this.getCaretLine().length;
				}
				break;
		}
	}
	
	this.validateValue(e);
};

// render
mexui.Control.TextInput.prototype.render = function()
{
	var pos = this.getScreenPosition();
	var pos2 = new Vec2(pos.x, pos.y);
	
	mexui.native.drawRectangle(pos, this.size, this.getStyles('main'));
	
	if(this.isEmpty())
	{
		mexui.native.drawText(pos, this.size, this.placeholder, this.getStyles('placeholder'));
	}
	else
	{
		var lineSize = new Vec2(this.size.x, this.lineHeight);
		for(var i=0,j=this.lines.length; i<j; i++)
		{
			var displayedText = this.masked ? '*'.repeat(this.lines[i].length) : this.lines[i];
			mexui.native.drawText(pos, lineSize, displayedText, this.getStyles('main'));
			
			pos.y += this.lineHeight;
		}
	}
	
	var valueIsInvalid = !this.isEmpty() && !this.validValue;
	
	if(this.isFocused())
	{
		if(!valueIsInvalid)
			mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos2,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('focused'));
		
		if(this.caretShownForBlink)
		{
			var pos = this.getScreenPosition();
			var text = this.lines[this.caretPosition.y].substr(0, this.caretPosition.x);
			var displayedText = this.masked ? '*'.repeat(text.length) : text;
			var textWidth = mexui.native.getTextWidth(displayedText, this.getStyles('main'));
			var caretPosOffset = new Vec2(5 + textWidth, (this.caretPosition.y * this.lineHeight) + 1);
			var caretPoint1 = mexui.util.addVec2(pos, caretPosOffset);
			var caretPoint2 = new Vec2(caretPoint1.x, caretPoint1.y + 22);
			mexui.native.drawAALine(caretPoint1, caretPoint2, this.getStyles('caret'));
		}
	}
	
	if(valueIsInvalid)
		mexui.native.drawRectangleBorder(mexui.util.subtractVec2(pos2,new Vec2(2,2)), mexui.util.addVec2(this.size,new Vec2(3,3)), this.getStyles('invalidValue'));
};

// model
mexui.Control.TextInput.prototype.getTextWithNewCharacter = function(character)
{
	return this.lines[this.caretPosition.y].substr(0, this.caretPosition.x) + character + this.lines[this.caretPosition.y].substr(this.caretPosition.x);
};

// caret
mexui.Control.TextInput.prototype.getCaretLine = function()
{
	return this.lines[this.caretPosition.y];
};

mexui.Control.TextInput.prototype.clampCaretPosition = function()
{
	if(this.caretPosition.y < 0)
		this.caretPosition.y = 0;
	else if(this.caretPosition.y > (this.lines.length - 1))
		this.caretPosition.y = this.lines.length - 1;
	
	if(this.caretPosition.x < 0)
		this.caretPosition.x = 0;
	else if(this.caretPosition.x > this.lines[this.caretPosition.y].length)
		this.caretPosition.x = this.lines[this.caretPosition.y].length;
};

mexui.Control.TextInput.prototype.getCaretPositionByCursor = function()
{
	var lineIndex = this.getCaretLineIndexByCursor();
	var charIndex = this.getCharIndexByCursor(lineIndex);
	return new Vec2(charIndex, lineIndex);
};

mexui.Control.TextInput.prototype.getCaretLineIndexByCursor = function()
{
	var yPos = gui.cursorPosition.y - this.getScreenPosition().y;
	var lineIndex = Math.floor(yPos / this.lineHeight);
	
	if(lineIndex < 0)
		return 0;
	else if(lineIndex > (this.lines.length - 1))
		return this.lines.length - 1;
	else
		return lineIndex;
};

mexui.Control.TextInput.prototype.getCharIndexByCursor = function(lineIndex)
{
	var xPos = gui.cursorPosition.x - this.getScreenPosition().x;
	var line = this.lines[lineIndex];
	var lineStyles = this.getStyles('caret');
	
	for(var i=0,j=line.length; i<j; i++)
	{
		var text = line.substr(0, i + 1);
		var textWidth = mexui.native.getTextWidth(text, lineStyles);
		
		if(xPos < textWidth)
			return i;
	}
	return line.length;
};

// lines
mexui.Control.TextInput.prototype.addLine = function(lineIndex)
{
	this.lines.splice(lineIndex, 0, '');
};

mexui.Control.TextInput.prototype.removeLine = function(lineIndex)
{
	this.lines.splice(lineIndex, 1);
};

mexui.Control.TextInput.prototype.getLineLength = function(lineIndex)
{
	return this.lines[lineIndex].length;
};

mexui.Control.TextInput.prototype.mergeLines = function(lineIndex)
{
	this.lines[lineIndex] += this.lines[lineIndex + 1];
	this.removeLine(lineIndex + 1);
};

mexui.Control.TextInput.prototype.splitLine = function(lineIndex)
{
	this.addLine(lineIndex + 1);
	this.lines[lineIndex + 1] = this.lines[lineIndex].substr(this.caretPosition.x);
	this.lines[lineIndex] = this.lines[lineIndex].substr(0, this.caretPosition.x);
};

// characters
mexui.Control.TextInput.prototype.canAddCharacter = function()
{
	return this.maxLength === false || this.lines.join("\r\n").length < this.maxLength;
};

mexui.Control.TextInput.prototype.deleteCharacter = function(charPos)
{
	this.lines[charPos.y] = this.lines[charPos.y].substr(0, charPos.x) + this.lines[charPos.y].substr(charPos.x + 1);
};

// text overall
mexui.Control.TextInput.prototype.setText = function(text)
{
	this.lines = mexui.util.splitLines(text);
};

mexui.Control.TextInput.prototype.getText = function()
{
	return this.lines.join("\r\n");
};

mexui.Control.TextInput.prototype.resetText = function()
{
	this.lines = [''];
};

mexui.Control.TextInput.prototype.isEmpty = function()
{
	return this.lines.length == 1 && this.lines[0] == '';
};

// validation
mexui.Control.TextInput.prototype.validateValue = function(e)
{
	this.validValue = this.validateValueCallback ? this.validateValueCallback(e) : true;
};