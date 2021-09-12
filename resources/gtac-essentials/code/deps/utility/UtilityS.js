global.util = {};

util.timers = {};
util.messages = {};

// data
util.boolOptionsLower = new Map();
util.boolOptionsLower.set('true', true);
util.boolOptionsLower.set('false', false);
util.boolOptionsLower.set('t', true);
util.boolOptionsLower.set('f', false);
util.boolOptionsLower.set('on', true);
util.boolOptionsLower.set('off', false);
util.boolOptionsLower.set('1', true);
util.boolOptionsLower.set('0', false);
util.boolOptionsLower.set('en', true);
util.boolOptionsLower.set('dis', false);
util.boolOptionsLower.set('enabled', true);
util.boolOptionsLower.set('disabled', false);

util.areas = [
	['Downtown', 0, -1613.03, 413.128, 0.0, -213.73, 1677.32, 300.0, 1],
	['Vice Point', 0, 163.656, -351.153, 0.0, 1246.03, 1398.85, 300.0, 1],
	['Washington Beach', 0, -103.97, -930.526, 0.0, 1246.03, -351.153, 300.0, 1],
	['Ocean Beach', 0, -253.206, -1805.37, 0.0, 1254.9, -930.526, 300.0, 1],
	['Airport', 0, -1888.21, -1779.61, 0.0, -1208.21, 230.39, 300.0, 1],
	['Starfish Island', 0, -748.206, -818.266, 0.0, -104.505, -241.467, 300.0, 1],
	['Fil Studio', 0, -213.73, 797.605, 0.0, 163.656, 1243.47, 300.0, 1],
	['Glof Club', 0, -213.73, -241.429, 0.0, 163.656, 797.605, 300.0, 1],
	['Junk Yard', 1, -1396.76, -42.9113, 0.0, -1208.21, 230.39, 300.0, 1],
	['Vice Port', 0, -1208.21, -1779.61, 0.0, -253.206, -898.738, 300.0, 1],
	['Little Havana', 0, -1208.21, -898.738, 0.0, -748.206, -241.467, 300.0, 1],
	['Little Haiti', 0, -1208.21, -241.467, 0.0, -578.289, 412.66, 300.0, 1]
];
util.disconnectReasons = [
	'Timeout',
	'Server Full',
	'Unsupported Client',
	'Unsupported Engine',
	'Wrong Password',
	'Unsupported Game Exe',
	'Regular Disconnect',
	'Banned',
	'Generic Failure',
	'Invalid Username',
	'Crash',
	'Public Key Mismatch',
	'Username In Use',
	'Kicked'
];
util.vehicleModelNames = [
	'LANDSTALKER',
	'IDAHO',
	'STINGER',
	'LINERUNNER',
	'PERENNIAL',
	'SENTINEL',
	'RIO',
	'FIRETRUCK',
	'TRASHMASTER',
	'STRETCH',
	'MANANA',
	'INFERNUS',
	'VOODOO',
	'PONY',
	'MULE',
	'CHEETAH',
	'AMBULANCE',
	'FBI WASHINGTON',
	'MOONBEAM',
	'ESPERANTO',
	'TAXI',
	'WASHINGTON',
	'BOBCAT',
	'MR.WHOOPEE',
	'BF-INJECTION',
	'HUNTER',
	'POLICE',
	'ENFORCER',
	'SECURICAR',
	'BANSHEE',
	'PREDATOR',
	'BUS',
	'RHINO',
	'BARRACKS OL',
	'CUBAN HERMES',
	'HELICOPTER',
	'ANGEL',
	'COACH',
	'CABBIE',
	'STALLION',
	'RUMPO',
	'RCBANDIT',
	'ROMERO\'S HEARSE',
	'PACKER',
	'SENTINEL XS',
	'ADMIRAL',
	'SQUALO',
	'SEA SPARROW',
	'PIZZA BOY',
	'GANG BURRITO',
	'AIRTRAIN',
	'DEADDODO',
	'SPEEDER',
	'REEFER',
	'TROPIC',
	'FLATBED',
	'YANKEE',
	'CADDY',
	'ZEBRA CAB',
	'TOP FUN',
	'SKIMMER',
	'PCJ-600',
	'FAGGIO',
	'FREEWAY',
	'RCBARON',
	'RCRAIDER',
	'GLENDALE',
	'OCEANIC',
	'SANCHEZ',
	'SPARROW',
	'PATRIOT',
	'LOVE FIST',
	'COAST GUARD',
	'DINGHY',
	'HERMES',
	'SABRE',
	'SABRE TURBO',
	'PHOENIX',
	'WALTON',
	'REGINA',
	'COMET',
	'DELUXO',
	'BURRITO',
	'SPAND EXPRESS',
	'MARQUIS',
	'BAGGAGE HANDLER',
	'KAUFMAN CAB',
	'MAVERICK',
	'VCN MAVERICK',
	'RANCHER',
	'FBI RANCHER',
	'VIRGO',
	'GREENWOOD',
	'CUBAN JETMAX',
	'HOTRING RACER#1',
	'SANDKING',
	'BLISTA COMPACT',
	'POLICE MAVERICK',
	'BOXVILLE',
	'BENSON',
	'MESA GRANDE',
	'RC GOBLIN',
	'HOTRING RACER#2',
	'HOTRING RACER#3',
	'BLOODRING BANGER#1',
	'BLOODRING BANGER#2',
	'VCPD CHEETAH'
];
util.weaponModelIds = [
	0,   259, 260, 261, 262, 263, 264, 265, 266, 267,
	268, 269, 270, 291, 271, 272, 273, 274, 275, 277,
	278, 279, 281, 282, 283, 284, 280, 276, 285, 286,
	287, 288, 289, 290
];
util.weaponNames = [
	'Unarmed',
	'Brass Knuckles',
	'Screw Driver',
	'Golf Club',
	'Night Stick',
	'Knife',
	'Baseball Bat',
	'Hammer',
	'Meat Cleaver',
	'Machete',
	'Katana',
	'Chainsaw',
	'Grenade',
	'Remote Detonation Grenades',
	'Tear Gas',
	'Molotov Cocktails',
	'Rocket',
	'Colt 45',
	'Python',
	'Chrome Shotgun',
	'Spaz Shotgun',
	'Stubby Shotgun',
	'Tec9',
	'Uzi',
	'Silenced Ingram',
	'Mp5',
	'M4',
	'Ruger',
	'Sniper Rifle',
	'Laser Sniper',
	'Rocket Launcher',
	'Flame Thrower',
	'M60',
	'Minigun'
];

// events
addEventHandler('onPlayerQuit', function(event, client)
{
	util.killClientTimer(client);
});

// angle
util.radians = function(deg)
{
	return deg * (Math.PI / 180.0);
};

util.degrees = function(rad)
{
	return rad * (180.0 / Math.PI);
};

util.degArr = (arr) =>
{
	return arr.map(v => util.degrees(v));
};

util.radArr = (arr) =>
{
	return arr.map(v => util.radians(v));
};

// area
util.getAreaName = function(pos)
{
	for(var i=0,j=util.areas.length; i<j; i++)
	{
		var area = util.areas[i];
		
		if(pos.x >= area[2] && pos.x <= area[5]
		&& pos.y >= area[3] && pos.y <= area[6]
		&& pos.z >= area[4] && pos.z <= area[7])
		{
			return area[0];
		}
	}
	return "Vice City";
};

util.getAreaDataByPosition = function(pos)
{
	for(var i=0,j=util.areas.length; i<j; i++)
	{
		var area = util.areas[i];
		
		if(pos.x >= area[2] && pos.x <= area[5]
		&& pos.y >= area[3] && pos.y <= area[6]
		&& pos.z >= area[4] && pos.z <= area[7])
		{
			return area;
		}
	}
	return [];
};

util.getAreaDataByName = function(name)
{
	name = name.toLowerCase();
	
	for(var i=0,j=util.areas.length; i<j; i++)
	{
		var area = util.areas[i];
		
		if(area[0].toLowerCase().indexOf(name) != -1)
		{
			return area;
		}
	}
	return [];
};

// args
util.getLastArg = function(str, defaultValue)
{
	str = str.trim();
	var args = str.split(' ');
	return str.length > 0 ? args[args.length - 1] : defaultValue;
};

util.getLastArgInt = function(str, defaultValue)
{
	str = str.trim();
	var args = str.split(' ');
	return str.length > 0 ? parseInt(args[args.length - 1]) : defaultValue;
};

util.getLastArgFloat = function(str, defaultValue)
{
	str = str.trim();
	var args = str.split(' ');
	return str.length > 0 ? parseFloat(args[args.length - 1]) : defaultValue;
};

// array
/*
util.array = function(...args)
{
	var out = [];
	
	for(var i=0,j=args.length; i<j; i++)
	{
		for(var i2=0,j2=args[i].length; i2<j2; i2++)
		{
			out.push(args[i][i2]);
		}
	}
	
	return out;
};
*/

util.getArrayKey = function(arr, value)
{
	var cmp = util.compareValues;
	for(var key in arr)
	{
		if(cmp(arr[key], value))
		{
			return key;
		}
	}
	return null;
};

util.inArray = function(arr, value)
{
	var cmp = util.compareValues;
	for(var key in arr)
	{
		if(cmp(arr[key], value))
		{
			return true;
		}
	}
	return false;
};

util.removeFromArray = function(arr, value)
{
	var key = util.getArrayKey(arr, value);
	
	if(key == null)
	{
		console.log('------------------------------------------');
		console.log('[UTILITY SCRIPT USAGE ERROR] util.removeFromArray. Value not found in array.');
		console.log('Value: '+value);
		console.log('Array length: '+arr.length);
		console.log('------------------------------------------');
	}
	else
	{
		arr.splice(key, 1);
	}
	
	return arr;
};

util.removeFromArray2d = function(arr, arrayValueToMatch)
{
	var keyMatch = null;
	
	for(var key in arr)
	{
		var match = true;
		for(var key2 in arr[key])
		{
			if(arr[key][key2] != arrayValueToMatch[key2])
			{
				match = false;
				break;
			}
		}
		
		if(match)
		{
			keyMatch = key;
			break;
		}
	}
	
	if(match)
	{
		arr.splice(keyMatch, 1);
	}
	
	return arr;
};

util.shuffle = function(array) // THIRD PARTY FUNCTION
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// client
util.getClientByIp = function(ip)
{
	var clients = getClients();
	for(var i in clients)
	{
		if(ip == clients[i].ip)
		{
			return clients[i];
		}
	}
	return null;
};

util.getClientDisconnectReason = function(disconnectTypeId)
{
	return util.disconnectReasons[disconnectTypeId];
};

util.findClient = function(text, defaultClient)
{
	text = text === undefined ? '' : text.trim();
	
	if(text.length == 0)
		return defaultClient;
	
	var clients = getClients();
	
	var textInt = parseInt(text, 10);
	
	if(!isNaN(textInt))
	{
		for(var clientId in clients)
		{
			if(textInt == clientId)
			{
				return clients[clientId];
			}
		}
	}
	
	var textLower = text.toLowerCase();
	
	for(var clientId in clients)
	{
		if(textLower == clients[clientId].name.toLowerCase())
		{
			return clients[clientId];
		}
	}
	
	for(var clientId in clients)
	{
		if(clients[clientId].name.toLowerCase().indexOf(textLower) != -1)
		{
			return clients[clientId];
		}
	}
	
	return null;
};

util.isClient = (text) =>
{
	return parseInt(text) == parseFloat(text) && util.findClient(text) !== null;
};

util.findCommand = (text) =>
{
	return cmds[text] === undefined ? null : cmds[text];
};

util.isCommand = (text) =>
{
	return util.findCommand(text) !== null;
};

// compare
util.compareValues = function(v1, v2)
{
	if(v1 instanceof Array)
	{
		if(v2 instanceof Array)
		{
			return util.compareArrays(v1, v2);
		}
		else
		{
			return false;
		}
	}
	else if(v2 instanceof Array)
	{
		return false;
	}
	else
	{
		return v1 == v2;
	}
};

util.compareArrays = function(a1, a2)
{
	var j = a1.length;
	
	if(j != a2.length)
		return false;
	
	var cmp = util.compareValues;
	
	for(var i=0; i<j; i++)
	{
		if(!cmp(a1[i], a2[i]))
		{
			return false;
		}
	}
	
	return true;
};

// element
util.getElementTypeName = function(elementTypeId)
{
	switch(elementTypeId)
	{
		case ELEMENT_PLAYER:		return 'Player';
		case ELEMENT_VEHICLE:		return 'Vehicle';
	}
	return 'Unknown-Element-Type';
};

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// file
util.getFileData = function(file)
{
	if(!file)
		return '';
	var data = file.readBytes(file.length);
	file.close();
	var s = ab2str(data);
	return s;
};

util.getFileData2 = function(path)
{
	var file = openFile(path);
	if(!file)
		return '';
	var data = file.readBytes(file.length);
	file.close();
	var s = ab2str(data);
	return s;
};

util.getFileLines = function(file)
{
	/*
	var data = util.getFileData(file);
	data = util.fixEOLs(data);
	return data.split("\n");
	*/
	if(file === null)
		return [];
	var tr = new TextReader(file);
	tr.loadText();
	var lines = [];
	var line;
	while((line = tr.readLine()) !== null) {
		lines.push(line);
	}
	//console.log(""+lines.length);
	return lines;
};

util.getFileLines2 = function(path)
{
	///*
	var data = util.getFileData2(path);
	//console.log(data.length);
	data = util.fixEOLs(data);
	return data.split("\n");
	//*/
	/*
	console.log(file);
	var tr = new TextReader(openFile(file));
	tr.loadText();
	var lines = [];
	var line;
	while(line = tr.readLine()) {
		lines.push(line);
	}
	return lines;
	*/
};

util.fixEOLs = function(data)
{
	data = data.replace("\r\n", "\n");
	data = data.replace("\r", "\n");
	return data;
};

// http
util.httpGet = function(url, postData, dataReceivedCallback, completedCallback)
{
	// This wrapper function fixes an issue in GTAC Server 1.1.22, where you must return the data length in the dataReceived callback, or the connection is closed.
	let buffer = '';
	httpGet(url, postData, dataReceived=>{
		if(dataReceivedCallback)
			dataReceivedCallback(dataReceived);
		buffer += dataReceived;
		return dataReceived.length;
	}, (curlErrorCode, httpResponseCode)=>{
		if(completedCallback && curlErrorCode == 0 && httpResponseCode == 200)
			completedCallback(buffer);
	});
};

util.http = function(url, completedCallback)
{
	util.httpGet(url, '', null, completedCallback);
};

// ip
util.isLocalHost = function(ip)
{
	return ip == '127.0.0.1';
};

util.isPrivateIp = function(ip)
{
	if(ip.indexOf('.') == -1)
		return false; // todo - IP version 6
	
	var parts = ip.split('.').map(v => parseInt(v));
	
	return parts[0] == 10
		|| (parts[0] == 192 && parts[1] == 168)
		|| (parts[0] == 172 && (parts[1] >= 16 && parts[1] <= 31));
};

// network
util.getNetCallArgs = function(networkEventName, clientFunctionName, args)
{
	if(!args)
		args = [];
	args.unshift(clientFunctionName);
	args.unshift(null);
	args.unshift(networkEventName);
	return args;
};

util.getClientNetCallArgs = function(networkEventName, client, clientFunctionName, args)
{
	if(!args)
		args = [];
	args.unshift(clientFunctionName);
	args.unshift(client);
	args.unshift(networkEventName);
	return args;
};

// number
util.rand = function(min, max)
{
	return Math.floor(Math.random() * (max - min) + min);
};

util.randLen = function(maxExclusive)
{
	return util.rand(0, maxExclusive - 1);
};

util.getRandomRGB = function()
{
	return [
		Math.floor(util.rand(0, 255)),
		Math.floor(util.rand(0, 255)),
		Math.floor(util.rand(0, 255))
	];
};

util.componentToHex = function(c)
{
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

util.rgbToHex = function(r, g, b)
{
	return util.componentToHex(r) + util.componentToHex(g) + util.componentToHex(b);
};

// object
util.addPair = function(object, queue, key, value, maxPairs)
{
	if(object[key] != null)
	{
		// ensure no duplicate keys
		var queueIndex = util.getArrayKey(queue, key);
		queue.splice(queueIndex, 1);
	}
	else if(queue.length >= maxPairs)
	{
		// ensure max size
		var oldestKey = queue.shift();
		delete object[oldestKey];
	}
	
	// add new item
	object[key] = value;
	queue.push(key);
};

// ped
util.getRandomPedModel = function()
{
	var skin = Math.floor(Math.random() * 196);
	if(skin == 8)
		skin = 9;
	return skin;
};

// position
util.isPositionNearAnyPosition = function(position, positions, minDistance)
{
	var j = positions.length;
	for(var i=0; i<j; i++)
	{
		if(position.distance(positions[i]) <= minDistance)
		{
			return true;
		}
	}
	return false;
};

util.getAllPlayerPositions = function()
{
	var positions = [];
	
	var clients = getClients();
	for(var i in clients)
	{
		if(!clients[i].player)
			continue;
		
		positions.push(clients[i].player.position);
	}
	
	return positions;
};

util.getElementsNotNearPlayers = function(elements, minDistance)
{
	return util.getElementsNotNearPositions(elements, util.getAllPlayerPositions(), minDistance);
};

util.getElementsNotNearPositions = function(elements, positions, minDistance)
{
	var elementsOut = [];
	
	const values = elements.values();
	for(var i=0, j=elements.size; i<j; i++)
	{
		var element = values.next().value;
		
		if(!util.isPositionNearAnyPosition(element.position, positions, minDistance))
		{
			elementsOut.push(element);
		}
	}
	
	return elementsOut;
};

util.getPositionNotFaced = function(client, distance)
{
	return client.player.position.addPolar(distance, util.radians(util.rand(0,360)));
};

// string
util.format = function() // THIRD PARTY FUNCTION
{
	var args = Array.prototype.slice.call(arguments, 0);
	var format = args.shift();
	return format.replace(/{(\d+)}/g, function(match, number)
	{
		return typeof args[number] != 'undefined'
			? args[number]
			: match
		;
	});
};

util.formatArr = function(text, args) // WRAPS A THIRD PARTY FUNCTION
{
	args.unshift(text);
	return util.format.apply(null, args);
};

// timer
util.clientTimer = function(client, callback, duration)
{
	return util.timer('CLIENT_TIMER_'+client.index, callback, duration);
};

util.killClientTimer = function(client)
{
	return util.killTimer('CLIENT_TIMER_'+client.index);
};

util.timer = function(timerName, callback, duration)
{
	util.killTimer(timerName);
	
	return util.timers[timerName] = setTimeout(()=>{
		util.killTimer(timerName);
		callback();
	}, duration);
};

util.killTimer = function(timerName)
{
	if(util.timers[timerName] == null)
		return;
	
	clearTimeout(util.timers[timerName]);
	delete util.timers[timerName];
};

// vehicle
util.findVehicleModelId = function(text, defaultVehicleModelId)
{
	if(text === undefined)
		return defaultVehicleModelId;
	
	text = text.trim();
	if(text.length == 0)
		return defaultVehicleModelId;
	
	var textInt = parseInt(text, 10);
	
	var minVehicleModelId = 130;
	var maxVehicleModelId = 236;
	
	if(!isNaN(textInt) && textInt >= minVehicleModelId && textInt <= maxVehicleModelId)
	{
		return textInt;
	}
	
	var vehicleModelNames = util.vehicleModelNames;
	
	var textLower = text.toLowerCase();
	
	for(var index=0; index<vehicleModelNames.length; index++)
	{
		if(textLower == vehicleModelNames[index].toLowerCase())
		{
			return index + minVehicleModelId;
		}
	}
	
	for(var index=0; index<vehicleModelNames.length; index++)
	{
		if(vehicleModelNames[index].toLowerCase().indexOf(textLower) != -1)
		{
			return index + minVehicleModelId;
		}
	}
	
	return -1;
};

util.getVehicleModelName = function(vehicleModelId)
{
	return util.vehicleModelNames[vehicleModelId];
};

// weapon
util.findWeapon = function(text)
{
	var textInt = parseInt(text, 10);
	
	var minWeaponlId = 0;
	var maxweaponId = 36;
	
	if(!isNaN(textInt) && textInt >= minWeaponlId && textInt <= maxweaponId)
	{
		return textInt;
	}
	
	var weaponNameLower = text.toLowerCase();
	
	for(var weaponId=0; weaponId<util.weaponNames.length; weaponId++)
	{
		if(util.weaponNames[weaponId].toLowerCase().indexOf(weaponNameLower) != -1)
		{
			return weaponId;
		}
	}
	
	return -1;
};

util.isWeapon = (text) =>
{
	return util.findWeapon(text) != -1;
};

util.getWeaponName = function(weaponId)
{
	return util.weaponNames[weaponId];
};

util.getWeaponModelId = function(weaponId)
{
	return util.weaponModelIds[weaponId];
};





util.findObjectModel = function(text)
{
	var textInt = parseInt(text, 10);
	
	var minWeaponlId = 0;
	var maxweaponId = 8000;
	
	if(!isNaN(textInt) && textInt >= minWeaponlId && textInt <= maxweaponId)
	{
		return textInt;
	}
	
	return -1;
};

util.isObjectModel = (text) =>
{
	return util.findObjectModel(text) != -1;
};





util.bindCommand = (cmd2, callback) =>
{
	addCommandHandler(cmd2, (cmd,arg,client) =>
	{
		var args = util.cleanSplit(arg);
		args.unshift(client);
		callback.apply(null, args);
	});
};

util.cleanSplit = (text) =>
{
	var t = text.trim().replace(/[\s\t]+/g, ' ').split(' ');
	return t.length == 1 && t[0] === '' ? [] : t;
};

util.round = (number, dp) =>
{
	var multiplier = Math.pow(10, dp);
	return Math.round((number + Number.EPSILON) * multiplier) / multiplier;
};

util.array = (object, count) =>
{
	if(count === undefined || count === null)
		return Array.prototype.slice.call(object, 0);
	else
		return Array.prototype.slice.call(object, 0, count);
};

util.posArray = (pos) =>
{
	return util.array(pos, 3);
};

util.rotArray = (rot, deg) =>
{
	rot = [rot.x, rot.y, rot.z];
	if(deg)
		return util.degArr(util.array(rot));
	else
		return util.array(rot);
		
};

util.pos = (client) =>
{
	return util.array(client.player.position);
};

util.rot = (client, deg) =>
{
	var rot = client.player.getRotation();
	rot = [rot.x, rot.y, rot.z];
	if(deg)
		rot = util.degArr(rot);
	return rot;
};

util.vehPos = (client) =>
{
	return util.array(client.player.vehicle.position);
};

util.vehRot = (client) =>
{
	var rot = client.player.vehicle.getRotation();
	rot = [rot.x, rot.y, rot.z];
	if(deg)
		rot = util.degArr(rot);
	return rot;
};

util.their = (client, target) =>
{
	return client == target ? 'their' : target.name + "'s";
};

util.int = (inputText, defaultValue) =>
{
	return inputText !== undefined && !isNaN(parseInt(inputText)) ? parseInt(inputText) : defaultValue;
};

util.float = (inputText, defaultValue) =>
{
	return inputText !== undefined && !isNaN(parseFloat(inputText)) ? parseFloat(inputText) : defaultValue;
};

util.bool = (inputText, defaultValue) =>
{
	return inputText !== undefined && util.boolOptionsLower.has(inputText.toLowerCase()) ? util.boolOptionsLower.get(inputText) : defaultValue;
};

util.vec3 = (inputText, defaultValue) =>
{
	if(inputText === undefined)
		return defaultValue;
	var vec3 = new Vec3();
	var parts = inputText.split(',').map(v => util.float(v));
	vec3.x = parts[0];
	vec3.y = parts[1];
	vec3.z = parts[2];
	return vec3;
};

util.vec3Rot = (inputText, inputIsDeg, defaultValue) =>
{
	if(!inputIsDeg)
		return util.vec3(inputText, defaultValue);
	
	if(inputText === undefined)
		return defaultValue;
	
	var vec3 = new Vec3();
	var parts = inputText.split(',').map(v => util.radians(util.float(v)));
	vec3.x = parts[0];
	vec3.y = parts[1];
	vec3.z = parts[2];
	return vec3;
};

util.isInt = (inputText) =>
{
	return inputText !== undefined && !isNaN(parseInt(inputText));
};

util.isFloat = (inputText) =>
{
	return inputText !== undefined && !isNaN(parseFloat(inputText));
};

util.isBool = (inputText) =>
{
	return inputText !== undefined && util.boolOptionsLower.has(inputText.toLowerCase());
};

util.between = (value, min, max) =>
{
	return value >= min && value <= max;
};

util.left = (inputText, startsWith, _default) =>
{
	if(inputText === undefined)
		return _default;
	for(var i in startsWith[0])
		if(inputText.startsWith(startsWith[0][i]))
			return true;
	for(var i in startsWith[1])
		if(inputText.startsWith(startsWith[1][i]))
			return false;
	return undefined;		
};

util.isLeftText = (text, options) =>
{
	return util.left(text, options, null) !== null;
};

util.deduceArgs = (client, conditions, ...args) =>
{
	var conditionIndex = 0;
	var maxIndex = 2;
	for(var i=maxIndex; i>=0; i--)
	{
		if(args[i] === undefined && conditions[i](args[i]))
		{
			args[i] = args[i + 1];
		}
	}
	return args;
	
	
	
	/*
	///console.log('aalen'+args.length);
	if(args[0] === undefined)
		return args;
	if(args[1] == undefined && condition())
	{
		//console.log('aa'+args[1]);
		args[1] = args[0];
		args[0] = client.name;
	}
	return args;
	*/
};

util.grabArgs = (client, conditions, defaults, ...argsIn) =>
{
	var argsOut = [];
	for(var i in conditions)
	{
		var match = false;
		for(var i2 in argsIn)
		{
			if(conditions[i](argsIn[i2]))
			{
				argsOut[i] = argsIn[i2];
				argsIn.splice(i2, 1);
				match = true;
				break;
			}
		}
		if(!match)
		{
			argsOut[i] = defaults[i];
		}
	}
	return argsOut;
};

util.getXMLArray = (root, tagName, mapcb) =>
{
	tagName = tagName.toLowerCase();
	var data = [];
	for(var i in root.children)
	{
		var v = root.children[i];
		if (v.name.toLowerCase() != tagName)
			continue;
		
		let entry = {};
		for(var i2 in v.attributes)
		{
			let v2 = v.attributes[i2];
			let i3 = i2.substr(0, 1).toLowerCase() + i2.substr(1);
			entry[i3] = v2;
		};
		
		data.push(mapcb(entry));
	}
	
	return data;
};

util.getXMLTag = (root, tagName) =>
{
	tagName = tagName.toLowerCase();
	for(var i in root.children)
	{
		var v = root.children[i];
		if (v.name.toLowerCase() != tagName)
			continue;
		
		let entry = {};
		for(var i2 in v.attributes)
		{
			let v2 = v.attributes[i2];
			let i3 = i2.substr(0, 1).toLowerCase() + i2.substr(1);
			entry[i3] = v2;
		};
		
		return entry;
	}
	
	return null;
};

util.loadXMLRoot = (path) =>
{
	var file = openFile(path);
	if(!file)
		return {};
	
	var xml = new XmlDocument();
	xml.load(file);
	
	var root = xml.rootElement;
	file.close();
	return root;
};

// network
var requestClientVariables = new Map();
var requestClientProperties = new Map();
var requestClientFunctionCalls = new Map();

addNetworkHandler('requestClientVariable', (client, result) =>
{
	if(!requestClientVariables.has(client))
		return;
	
	var callback = requestClientVariables.get(client);
	requestClientVariables.delete(client);
	callback(result);
});

addNetworkHandler('requestClientProperty', (client, result) =>
{
	if(!requestClientProperties.has(client))
		return;
	
	var callback = requestClientProperties.get(client);
	requestClientProperties.delete(client);
	callback(result);
});

addNetworkHandler('requestClientFunctionCall', (client, result) =>
{
	if(!requestClientFunctionCalls.has(client))
		return;
	
	var callback = requestClientFunctionCalls.get(client);
	requestClientFunctionCalls.delete(client);
	callback(result);
});

util.callClientFunction = (client, functionName, ...args) =>
{
	triggerNetworkEvent('callClientFunction', client, functionName, ...args);
};

util.callClientsFunction = (functionName, ...args) =>
{
	triggerNetworkEvent('callClientFunction', null, functionName, ...args);
};

util.callClientMethod = (client, methodName, ...args) =>
{
	triggerNetworkEvent('callClientMethod', client, methodName, ...args);
};

util.callClientsMethod = (methodName, ...args) =>
{
	triggerNetworkEvent('callClientMethod', null, methodName, ...args);
};

util.requestClientVariable = (client, variableName, callback) =>
{
	requestClientVariables.set(client, callback);
	triggerNetworkEvent('requestClientVariable', client, variableName);
};

util.requestClientProperty = (client, propertyName, callback) =>
{
	requestClientProperties.set(client, callback);
	triggerNetworkEvent('requestClientProperty', client, propertyName);
};

util.requestClientFunctionCall = (client, functionName, callback, ...args) =>
{
	requestClientFunctionCalls.set(client, callback);
	triggerNetworkEvent('requestClientFunctionCall', client, functionName, ...args);
};

util.setClientVariable = (client, variableName, variableValue) =>
{
	triggerNetworkEvent('setClientVariable', client, variableName, variableValue);
};

util.setClientProperty = (client, variableName, variableValue) =>
{
	triggerNetworkEvent('setClientVariable', client, variableName, variableValue);
};

util.setClientsVariable = (variableName, variableValue) =>
{
	triggerNetworkEvent('setClientVariable', null, variableName, variableValue);
};

util.setClientsProperty = (variableName, variableValue) =>
{
	triggerNetworkEvent('setClientVariable', null, variableName, variableValue);
};

