mexui.native = {};

// images
mexui.native.loadImage = function(imageFilePath, imageName)
{
	var file = openFile(imageFilePath);
	if(!file)
	{
		console.log('ERROR [IMAGE LOAD] - Opening File: '+imageFilePath);
		return false;
	}
	
	var image = null;
	var parts = imageFilePath.split('.');
	var ext = parts[parts.length - 1].toLowerCase();
	if(ext == 'png')
		image = graphics.loadPNG(file);
	else if(ext == 'bmp')
		image = graphics.loadBMP(file);
	else
	{
		console.log('ERROR [IMAGE LOAD] - Unsupported image file path extension. Currently only supports PNG or BMP.');
		return false;
	}
	
	if(!image)
	{
		file.close();
		console.log('ERROR [IMAGE LOAD] - Reading File: '+imageFilePath);
		return false;
	}
	
	file.close();
	
	if(imageName)
		mexui.images[imageName] = image;
	
	return image;
};

// fonts
mexui.native.getFont = function(textSize, textFont)
{
	var textSizeStr = textSize + '';
	
	if(!mexui.fonts[textSizeStr])
	{
		mexui.fonts[textSizeStr] = {};
	}
	
	if(!mexui.fonts[textSizeStr][textFont])
	{
		mexui.fonts[textSizeStr][textFont] = lucasFont.createDefaultFont(textSize, textFont);
	}
	
	return mexui.fonts[textSizeStr][textFont];
};

// text size
mexui.native.getTextSize = function(text, styles, font)
{
	if(!font)
		font = mexui.native.getFont(styles.textSize, styles.textFont);
	
	var size = font.measure(text + '', 10000, styles.textAlign, 0.0, styles.textSize, false, false);
	
	//if(text[text.length - 1] == ' ')
	//	width += mexui.util.getStringCount(text, ' ') * spaceWidth;
	
	return size;
};

mexui.native.getTextWidth = function(text, styles, font)
{
	return mexui.native.getTextSize(text, styles, font).x;
};

mexui.native.getTextHeight = function(text, styles, font)
{
	return mexui.native.getTextSize(text, styles, font).y;
};

// render
mexui.native.drawRectangle = function(position, size, styles)
{
	mexui.native.drawRectangleBackground(position, size, styles);
	mexui.native.drawRectangleBorder(position, size, styles);
};

mexui.native.drawRectangleBackground = function(position, size, styles)
{
	var backgroundColour = styles.backgroundColour != null ? styles.backgroundColour : styles.backgroundColor;
	if(backgroundColour == null || backgroundColour == 'none')
		return;
	
	graphics.drawRectangle(null, position, size, backgroundColour, backgroundColour, backgroundColour, backgroundColour);
};

mexui.native.drawRectangleBorder = function(position, size, styles)
{
	var borderColour = styles.borderColour || styles.borderColor;
	if(borderColour == null || borderColour == 'none')
		return;
	
	var rightXPosition			= position.x + size.x;
	var bottomYPosition			= position.y + size.y;
	
	var topLeftPosition			= new Vec2(position.x, position.y);
	var topRightPosition		= new Vec2(rightXPosition, position.y);
	var bottomLeftPosition		= new Vec2(position.x, bottomYPosition);
	var bottomRightPosition		= new Vec2(rightXPosition, bottomYPosition);
	
	var original = styles.lineColour;
	
	styles.lineColour = styles.topBorderColour != null ? styles.topBorderColour : (styles.topBorderColor != null ? styles.topBorderColor : borderColour);
	mexui.native.drawAALine(topLeftPosition, topRightPosition, styles);
	
	styles.lineColour = styles.leftBorderColour != null ? styles.leftBorderColour : (styles.leftBorderColor != null ? styles.leftBorderColor : borderColour);
	mexui.native.drawAALine(topLeftPosition, bottomLeftPosition, styles);
	
	styles.lineColour = styles.bottomBorderColour != null ? styles.bottomBorderColour : (styles.bottomBorderColor != null ? styles.bottomBorderColor : borderColour);
	mexui.native.drawAALine(bottomLeftPosition, bottomRightPosition, styles);
	
	styles.lineColour = styles.rightBorderColour != null ? styles.rightBorderColour : (styles.rightBorderColor != null ? styles.rightBorderColor : borderColour);
	mexui.native.drawAALine(topRightPosition, bottomRightPosition, styles);
	
	styles.lineColour = original;
};

mexui.native.drawAALine = function(point1, point2, styles)
{
	var lineColour = styles.lineColour != null ? styles.lineColour : styles.lineColor;
	if(lineColour == null || lineColour == 'none')
		return;
	
	graphics.drawRectangle(null, point1, new Vec2((point2.x - point1.x) + styles.lineWeight, (point2.y - point1.y) + styles.lineWeight), lineColour, lineColour, lineColour, lineColour);
};

mexui.native.drawText = function(position, size, text, styles)
{
	var font = mexui.native.getFont(styles.textSize, styles.textFont);
	
	var textHeight = mexui.native.getTextHeight(text, styles, font);
	var textIndent = styles.textAlign == 0.0 || styles.textAlign == 1.0 ? styles.textIndent : 0;
	var textPos = new Vec2(position.x + textIndent, position.y + ((size.y - textHeight) / 2.0));
	
	font.render(text + '', textPos, size.x, styles.textAlign, 0.0, styles.textSize, styles.textColour != null ? styles.textColour : styles.textColor);
};

mexui.native.drawImage = function(position, size, image, styles)
{
	graphics.drawRectangle(image, position, size);
};

