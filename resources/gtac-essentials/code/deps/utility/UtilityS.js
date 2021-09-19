global.util = global.util || {};

util.timers = {};
util.messages = {};

// data
util.gameNames = ['', 'GTA III', 'GTA VC', 'GTA SA', 'GTA IV'];

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

// word
util.isAre = (count) =>
{
	return count == 1 ? 'is' : 'are';
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

util._in = (arr, value) =>
{
	for(var i in arr)
	{
		if(value == arr[i])
		{
			return true;
		}
	}
	return false;
};

util.bindCommand = (cmd2, callback) =>
{
	addCommandHandler(cmd2, (cmd,arg,client) =>
	{
		if(clientData.get(client, 'registered') && !clientData.get(client, 'loggedIn') && cmd.toLowerCase() != 'login')
			return chat.pm(client, "You aren't logged in.");
		
		if(admin.isCommandDisabled(cmd))
			return chat.pm(client, 'Command /' + cmd + ' is disabled.');
		
		if(admin.getClientLevel(client) < admin.getCommandLevel(cmd))
			return chat.pm(client, 'Command /' + cmd + ' requires admin level ' + admin.getCommandLevel(cmd) + '.');
		
		var args = util.cleanSplit(arg);
		args.unshift(client);
		callback.apply(null, args);
	});
};

util.unbindCommand = (cmd) =>
{
	removeCommandHandler(cmd);
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
		return util.degArr(util.array(rot, 3));
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

util.vec3ToArray = (vec) =>
{
	return [vec.x, vec.y, vec.z];
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

util.plural = (text, count) =>
{
	if(count == 1)
		return text;
	return text + 's';
};

util.pluralWithCount = (text, count) =>
{
	return count + ' ' + util.plural(text, count);
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

util.hour = (hour) =>
{
	return hour < 10 ? ('0' + hour) : hour;
};

util.minute = (minute) =>
{
	return minute < 10 ? ('0' + minute) : minute;
};

util.key = (text) =>
{
	if(text === undefined)
		return;
	return (text >= 'A' && text <= 'Z')
		|| (text >= 'a' && text <= 'z')
		|| (text >= '0' && text <= '9')
		? text[0]
		: null;
};

util.command = (text) =>
{
	if(text === undefined)
		return text;
	if(text[0] == '/')
		text = text.substr(1);
	return text;
};

util.isKey = (text) =>
{
	return util.key(text) != null;
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

util.toString = (object) =>
{
	if(object instanceof Vec3)
		return object.x+','+object.y+','+object.z;
	if(object instanceof Vec2)
		return object.x+','+object.y;
	return object.toString();
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

util.getResolvedItem = (itemName) =>
{
	var o = global;
	var parts = itemName.split('.');
	for(var i in parts)
		o = o[parts[i]];
	return o;
};

util.clientFunctionCalls =
[
	'keyBinds.onClientKeyDown',
	'mapper.storeActiveObject',
	'elements.isElementOnScreen',
	'removeMode.removeElement'
];

addNetworkHandler('callServerFunction', (client, functionName, ...args) =>
{
	for(var i in util.clientFunctionCalls)
	{
		if(functionName == util.clientFunctionCalls[i])
		{
			util.getResolvedItem(functionName)(client, ...args);
			break;
		}
	}
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

util.setClientProperty = (client, elementId, propertyName, propertyValue) =>
{
	triggerNetworkEvent('setClientProperty', client, elementId, propertyName, propertyValue);
};

util.setClientsVariable = (variableName, variableValue) =>
{
	triggerNetworkEvent('setClientVariable', null, variableName, variableValue);
};

util.setClientsProperty = (elementId, propertyName, propertyValue) =>
{
	triggerNetworkEvent('setClientProperty', null, elementId, propertyName, propertyValue);
};

util.getGameName = (gameId) =>
{
	return util.gameNames[gameId] ? util.gameNames[gameId] : 'Unknown Game';
};

util.objectsToArray = (objects, properties) =>
{
	var result = [];
	for(var i in objects)
	{
		var arr = [];
		for(var i2 in properties)
		{
			arr.push(objects[i][properties[i2]]);
		}
		result.push(arr);
	}
	return result;
};

