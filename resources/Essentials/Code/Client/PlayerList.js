global.playerList = {};

playerList.shown = false;
playerList.maxColumnEntries = 15;
playerList.font = lucasFont.createDefaultFont(16.0, 'Arial');
playerList.yellow = toColour(0xFF, 0xFF, 0, 0xFF);
playerList.orange = toColour(0xFF, 0x8F, 0, 0xFF);

playerList.setShown = (shown) =>
{
	playerList.shown = shown;

	if(shown)
	{
		events.bindNow('OnBeforeDrawHUD', playerList.draw);
		setChatWindowEnabled(false);
		setHUDEnabled(false);
	}
	else
	{
		events.unbindNow('OnBeforeDrawHUD');
		setChatWindowEnabled(true);
		setHUDEnabled(true);
	}
};

playerList.toggleShown = () =>
{
	playerList.setShown(!playerList.shown);
};

playerList.draw = () =>
{
	let position = util.xy(0.1, 0.1);
	let size = util.xy(0.8, 0.8);
	let colour = 0x372648FF;
	graphics.drawRectangle(null, position, size, colour, colour, colour, colour);

	let columnWidth1 = 0.045;
	let columnWidth2 = 0.15;
	let yInitial = 0.16;
	let xSpacing = 0.01;
	let xStep = columnWidth1 + columnWidth2 + xSpacing;
	let yStep = 0.035;
	let x = 0.11;
	let y = yInitial;

	let clients = getClients();

	clients.sort((v1, v2) => v2.name < v1.name);

	{
		let columnCount = Math.ceil(clients.length / playerList.maxColumnEntries);
		let x = 0.11;
		let y = 0.115;
		for(let i=0; i<columnCount; i++)
		{
			playerList.font.render('ID', util.xy(x, y), columnWidth1, 0.0, 0.0, 16.0, playerList.orange);
			playerList.font.render('Username', util.xy(x + columnWidth1, y), columnWidth2, 0.0, 0.0, 16.0, playerList.orange);

			x += xStep;
		}
	}

	for(var i in clients)
	{
		playerList.font.render(clients[i].index + '', util.xy(x, y), columnWidth1, 0.0, 0.0, 14.0, playerList.yellow);
		playerList.font.render(clients[i].name, util.xy(x + columnWidth1, y), columnWidth2, 0.0, 0.0, 14.0, playerList.yellow);

		if((i % playerList.maxColumnEntries) == 0 && (i != 0 || playerList.maxColumnEntries == 1))
		{
			y = yInitial;
			x += xStep;
		}
		else
		{
			y += yStep;
		}
	}
};

bindKey(SDLK_TAB, KEYSTATE_DOWN, playerList.toggleShown);

