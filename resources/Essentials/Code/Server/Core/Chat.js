global.chat = {};

chat.messages = {};
chat.colours = {};

// data
chat.messages.PM_NOT_SPAWNED		= 'Player {0} is not spawned.';
chat.messages.PM_NOT_IN_VEHICLE		= 'Player {0} is not in a vehicle.';
chat.messages.PM_INVALID_OPTION		= 'Invalid option. Available options are {0}. You typed: {1}';
chat.messages.PM_INVALID_COMMAND	= 'Command /{0} not found.';
chat.messages.PM_INVALID_KEY		= 'Key {0} not found.';
chat.messages.PM_INVALID_WEAPON		= 'Weapon {0} not found.';
chat.messages.PM_ELEMENT_NOT_FOUND	= '{0} not found. You typed: {1}';
chat.messages.PM_MODEL_NOT_FOUND	= '{0} model not found. You typed: {1}';
chat.messages.PM_INT_TOO_BIG		= 'Maximum number for {0} is {1}. You typed: {2}';
chat.messages.PM_INT_BETWEEN		= 'Integer for {0} should be between {1} and {2}. You typed: {3}';
chat.messages.PM_FLOAT_BETWEEN		= 'Number for {0} should be between {1} and {2}. You typed: {3}';
chat.messages.PM_INT				= '{0} should be an integer. You typed: {1}';
chat.messages.PM_FLOAT				= '{0} should be a number. You typed: {1}';
chat.messages.PM_BOOL				= '{0} should be a boolean (e.g. on, off, 1, 0, etc.). You typed: {1}';

chat.colours.all = toColour(255, 0, 20);
chat.colours.pm = toColour(255, 128, 20);

// main functions
chat.all = function(text, ...args)
{
	message(util.formatArr(text, args), chat.colours.all);
};

chat.pm = function(client, text, ...args)
{
	messageClient(util.formatArr(text, args), client, chat.colours.pm);
};

// command error functions
chat.invalidClient = function(client, inputText)
{
	chat.pm(client, chat.messages.PM_ELEMENT_NOT_FOUND, 'Player', inputText);
};

chat.invalidOption = function(client, options, inputText)
{
	chat.pm(client, chat.messages.PM_INVALID_OPTION, options, inputText);
};

chat.invalidElement = function(client, elementTypeId, inputText)
{
	chat.pm(client, chat.messages.PM_ELEMENT_NOT_FOUND, util.getElementTypeName(elementTypeId), inputText);
};

chat.notSpawned = function(client, targetClient)
{
	chat.pm(client, chat.messages.PM_NOT_SPAWNED, targetClient.name);
};

chat.notInVehicle = function(client, targetClient)
{
	chat.pm(client, chat.messages.PM_NOT_IN_VEHICLE, targetClient.name);
};

chat.invalidModel = function(client, elementTypeId, inputText)
{
	chat.pm(client, chat.messages.PM_MODEL_NOT_FOUND, util.getElementTypeName(elementTypeId), inputText);
};

chat.invalidCommand = function(client, inputText)
{
	chat.pm(client, chat.messages.PM_INVALID_COMMAND, inputText);
};

chat.invalidKey = function(client, inputText)
{
	chat.pm(client, chat.messages.PM_INVALID_KEY, inputText);
};

chat.invalidWeapon = function(client, inputText)
{
	chat.pm(client, chat.messages.PM_INVALID_WEAPON, inputText);
};

chat.intTooBig = function(client, intName, max, inputText)
{
	chat.pm(client, chat.messages.PM_INT_TOO_BIG, intName, max, inputText);
};

chat.intBetween = function(client, intName, min, max, inputText)
{
	chat.pm(client, chat.messages.PM_INT_BETWEEN, intName, min, max, inputText);
};

chat.floatBetween = function(client, floatName, min, max, inputText)
{
	chat.pm(client, chat.messages.PM_FLOAT_BETWEEN, floatName, min, max, inputText);
};

chat.int = function(client, intName, inputText)
{
	chat.pm(client, chat.messages.PM_INT, intName, inputText);
};

chat.float = function(client, floatName, inputText)
{
	chat.pm(client, chat.messages.PM_FLOAT, floatName, inputText);
};

chat.bool = function(client, boolName, inputText)
{
	chat.pm(client, chat.messages.PM_BOOL, boolName, inputText);
};

