global.util = {};

util.timers = {};
util.messages = {};

// data
util.modelRanges = [];

util.modelRanges[GAME_GTA_III] = {};
util.modelRanges[GAME_GTA_VC] = {};
util.modelRanges[GAME_GTA_SA] = {};
util.modelRanges[GAME_GTA_IV] = {};

util.modelRanges[GAME_GTA_III].objects = { min: 0, max: 8000 };
util.modelRanges[GAME_GTA_III].vehicles = { min: 90, max: 150 };
util.modelRanges[GAME_GTA_III].blips = { min: 0, max: 20 };
util.modelRanges[GAME_GTA_III].peds = { min: 1, max: 126, invalid: [26, 27, 28, 29] };
util.modelRanges[GAME_GTA_III].weapons = { min: 0, max: 12 };

util.modelRanges[GAME_GTA_VC].objects = { min: 0, max: 8000 };
util.modelRanges[GAME_GTA_VC].vehicles = { min: 130, max: 236 };
util.modelRanges[GAME_GTA_VC].blips = { min: 0, max: 39 };
util.modelRanges[GAME_GTA_VC].peds = { min: 0, max: 195, invalid: [8] };
util.modelRanges[GAME_GTA_VC].weapons = { min: 0, max: 36 };

util.modelRanges[GAME_GTA_SA].objects = { min: 0, max: 8000 };
util.modelRanges[GAME_GTA_SA].vehicles = { min: 400, max: 611 };
util.modelRanges[GAME_GTA_SA].blips = { min: 0, max: 63 };
util.modelRanges[GAME_GTA_SA].peds = { min: 0, max: 312 };
util.modelRanges[GAME_GTA_SA].weapons = { min: 0, max: 46 };

util.modelRanges[GAME_GTA_IV].objects = { min: 0, max: 8000 };
util.modelRanges[GAME_GTA_IV].vehicles = { min: 100, max: 100 };
util.modelRanges[GAME_GTA_IV].blips = { min: 0, max: 94 };
util.modelRanges[GAME_GTA_IV].peds = { min: 100, max: 100 };
util.modelRanges[GAME_GTA_IV].weapons = { min: 0, max: 46 };

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
util.vehicleModelNames = [];
util.vehicleModelNames[GAME_GTA_III] = [
	'LANDSTALKER',
	'IDAHO',
	'STINGER',
	'LINERUNNER',
	'PERENNIAL',
	'SENTINEL',
	'PATRIOT',
	'FIRE TRUCK',
	'TRASHMASTER',
	'STRETCH',
	'MANANA',
	'INFERNUS',
	'BLISTA',
	'PONY',
	'MULE',
	'CHEETAH',
	'AMBULANCE',
	'FBI CAR',
	'MOONBEAM',
	'ESPERANTO',
	'TAXI',
	'KURUMA',
	'BOBCAT',
	'MR. WHOOPEE',
	'BF INJECTION',
	'MANANA (CORPSE)',
	'ENFORCER',
	'SECURICAR',
	'BANSHEE',
	'PREDATOR',
	'BUS',
	'RHINO',
	'BARRACKS OL',
	'TRAIN',
	'POLICE HELICOPTER',
	'DODO',
	'COACH',
	'CABBIE',
	'STALLION',
	'RUMPO',
	'RC BANDIT',
	'BELLYUP',
	'MR. WONGS',
	'MAFIA SENTINEL',
	'YARDIE LOBO',
	'YAKUZA STINGER',
	'DIABLO STALLION',
	'CARTEL CRUISER',
	'HOODS RUMPO XL',
	'AIR TRAIN',
	'DEAD DODO',
	'SPEEDER',
	'REEFER',
	'PANLANTIC',
	'FLATBED',
	'YANKEE',
	'ESCAPE',
	'BORGNINE TAXI',
	'TOYZ VAN',
	'GHOST'
];
util.vehicleModelNames[GAME_GTA_VC] = [
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
util.vehicleModelNames[GAME_GTA_SA] = [
	'LANDSTALKER',
	'BRAVURA',
	'BUFFALO',
	'LINERUNNER',
	'PERRENIAL',
	'SENTINEL',
	'DUMPER',
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
	'LEVIATHAN',
	'MOONBEAM',
	'ESPERANTO',
	'TAXI',
	'WASHINGTON',
	'BOBCAT',
	'WHOOPEE',
	'BF-INJECTION',
	'HUNTER',
	'PREMIER',
	'ENFORCER',
	'SECURICAR',
	'BANSHEE',
	'PREDATOR',
	'BUS',
	'RHINO',
	'BARRACKS',
	'HOTKNIFE',
	'TRAILER',
	'PREVION',
	'COACH',
	'CABBIE',
	'STALLION',
	'RUMPO',
	'RC BANDIT',
	'ROMERO',
	'PACKER',
	'MONSTER',
	'ADMIRAL',
	'SQUALO',
	'SEASPARROW',
	'PIZZABOY',
	'TRAM',
	'TRAILER',
	'TURISMO',
	'SPEEDER',
	'REEFER',
	'TROPIC',
	'FLATBED',
	'YANKEE',
	'CADDY',
	'SOLAIR',
	'BERKLEY\'S RC VAN',
	'SKIMMER',
	'PCJ-600',
	'FAGGIO',
	'FREEWAY',
	'RC BARON',
	'RC RAIDER',
	'GLENDALE',
	'OCEANIC',
	'SANCHEZ',
	'SPARROW',
	'PATRIOT',
	'QUAD',
	'COASTGUARD',
	'DINGHY',
	'HERMES',
	'SABRE',
	'RUSTLER',
	'ZR-350',
	'WALTON',
	'REGINA',
	'COMET',
	'BMX',
	'BURRITO',
	'CAMPER',
	'MARQUIS',
	'BAGGAGE',
	'DOZER',
	'MAVERICK',
	'NEWS CHOPPER',
	'RANCHER',
	'FBI-RANCHER',
	'VIRGO',
	'GREENWOOD',
	'JETMAX',
	'HOTRING',
	'SANDKING',
	'BLISTA COMPACT',
	'POLICE MAVERICK',
	'BOXVILLE',
	'BENSON',
	'MESA',
	'RC GOBLIN',
	'HOTRING RACER A',
	'HOTRING RACER B',
	'BLOODRING BANGER',
	'RANCHER',
	'SUPER-GT',
	'ELEGANT',
	'JOURNEY',
	'BIKE',
	'MOUNTAIN BIKE',
	'BEAGLE',
	'CROPDUSTER',
	'STUNT',
	'TANKER',
	'ROADTRAIN',
	'NEBULA',
	'MAJESTIC',
	'BUCCANEER',
	'SHAMAL',
	'HYDRA',
	'FCR-900',
	'NRG-500',
	'HPV1000',
	'CEMENT TRUCK',
	'TOW TRUCK',
	'FORTUNE',
	'CADRONA',
	'FBI-TRUCK',
	'WILLARD',
	'FORKLIFT',
	'TRACTOR',
	'COMBINE',
	'FELTZER',
	'REMINGTON',
	'SLAMVAN',
	'BLADE',
	'FREIGHT',
	'STREAK',
	'VORTEX',
	'VINCENT',
	'BULLET',
	'CLOVER',
	'SADLER',
	'FIRETRUCK',
	'HUSTLER',
	'INTRUDER',
	'PRIMO',
	'CARGOBOB',
	'TAMPA',
	'SUNRISE',
	'MERIT',
	'UTILITY',
	'NEVADA',
	'YOSEMITE',
	'WINDSOR',
	'MONSTER',
	'MONSTER',
	'URANUS',
	'JESTER',
	'SULTAN',
	'STRATIUM',
	'ELEGY',
	'RAINDANCE',
	'RC TIGER',
	'FLASH',
	'TAHOMA',
	'SAVANNA',
	'BANDITO',
	'FREIGHT FLAT',
	'STREAK CARRIAGE',
	'KART',
	'MOWER',
	'DUNE',
	'SWEEPER',
	'BROADWAY',
	'TORNADO',
	'AT-400',
	'DFT-30',
	'HUNTLEY',
	'STAFFORD',
	'BF-400',
	'NEWS VAN',
	'TUG',
	'TRAILER',
	'EMPEROR',
	'WAYFARER',
	'EUROS',
	'HOTDOG',
	'CLUB',
	'FREIGHT BOX',
	'TRAILER',
	'ANDROMADA',
	'DODO',
	'RC CAM',
	'LAUNCH',
	'LSPD',
	'SFPD',
	'SFPD',
	'POLICE RANGER',
	'PICADOR',
	'S.W.A.T',
	'ALPHA',
	'PHOENIX',
	'GLENDALE',
	'SADLER',
	'LUGGAGE',
	'LUGGAGE',
	'STAIRS',
	'BOXVILLE',
	'TILLER',
	'UTILITY TRAILER'
];
util.vehicleModelNames[GAME_GTA_IV] = [
	'Admiral',
	'Airtug',
	'Ambulance',
	'Banshee',
	'Benson',
	'Biff',
	'Blista',
	'Bobcat',
	'Boxville',
	'Buccaneer',
	'Burrito',
	'Burrito 2',
	'Bus',
	'Cabby',
	'Cavalcade',
	'Chavos',
	'Cognoscenti',
	'Comet',
	'Coquette',
	'DF8',
	'Dillettante',
	'Dukes',
	'E109',
	'Emperor',
	'Rusty Emperor',
	'Esperanto',
	'Faction',
	'FIB Car',
	'Feltzer',
	'Feroci',
	'Airport Feroci',
	'Firetruck',
	'Flatbed',
	'Fortune',
	'Forklift',
	'Futo',
	'FXT',
	'Habanero',
	'Hakumai',
	'Huntley',
	'Infernus',
	'Ingot',
	'Intruder',
	'Landstalker',
	'Lokus',
	'Manana',
	'Marbella',
	'Merit',
	'Minivan',
	'Moonbeam',
	'Mr. Tasty',
	'Mule',
	'Noose Patrol Car',
	'Noose Stockade',
	'Oracle',
	'Packer',
	'Patriot',
	'Perennial',
	'Airport Perennial',
	'Peyote',
	'Phantom',
	'Pinnacle',
	'PMP-600',
	'Police Cruiser',
	'Police Patrol',
	'Police Patriot',
	'Pony',
	'Premier',
	'Presidente',
	'Primo',
	'Police Stockade',
	'Rancher',
	'Rebla',
	'Reply',
	'Romero',
	'Roman\'s Taxi',
	'Ruiner',
	'Sabre',
	'Sabre 2',
	'Sabre GT',
	'Schafter',
	'Sentinel',
	'Solair',
	'Speedo',
	'Stallion',
	'Steed',
	'Stockade',
	'Stratum',
	'Stretch',
	'Sultan',
	'Sultan RS',
	'Super GT',
	'Taxi',
	'Taxi 2',
	'Trashmaster',
	'Turismo',
	'Uranus',
	'Vigero',
	'Vigero 2',
	'Vincent',
	'Virgo',
	'Voodoo',
	'Washington',
	'Willard',
	'Yankee',
	'Bobber',
	'Faggio',
	'Hellfury',
	'NRG-900',
	'PCJ-600',
	'Sanchez',
	'Zombie',
	'Annihilator',
	'Maverick',
	'Police Maverick',
	'Tour Maverick',
	'Dinghy',
	'Jetmax',
	'Marquis',
	'Predator',
	'Reefer',
	'Squalo',
	'Tuga',
	'Tropic',
	'Cablecar',
	'Subway',
	'El Train'
];

util.weaponModelIds = [
	0,   259, 260, 261, 262, 263, 264, 265, 266, 267,
	268, 269, 270, 291, 271, 272, 273, 274, 275, 277,
	278, 279, 281, 282, 283, 284, 280, 276, 285, 286,
	287, 288, 289, 290
];
util.weaponNames = [];
util.weaponNames[GAME_GTA_III] = [
	'Fist',
	'Baseball Bat',
	'Colt 45',
	'Uzi',
	'Shotgun',
	'AK-47',
	'M16',
	'Sniper Rifle',
	'Rocket Launcher',
	'Flamethrower',
	'Molotov',
	'Grenade',
	'Detonator'
];
util.weaponNames[GAME_GTA_VC] = [
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
util.weaponNames[GAME_GTA_SA] = [
	'Fist',
	'Brass Knuckles',
	'Golf Club',
	'Nightstick',
	'Knife',
	'Baseball Bat',
	'Shovel',
	'Pool Cue',
	'Katana',
	'Chainsaw',
	'Purple Dildo',
	'Dildo',
	'Vibrator',
	'Silver Vibrator',
	'Flowers',
	'Cane',
	'Grenade',
	'Tear Gas',
	'Molotov Cocktail',
	'9mm',
	'Silenced 9mm',
	'Desert Eagle',
	'Shotgun',
	'Sawnoff Shotgun',
	'Combat Shotgun',
	'Micro SMG/Uzi',
	'MP5',
	'AK-47',
	'M4',
	'Tec-9',
	'Country Rifle',
	'Sniper Rifle',
	'RPG',
	'HS Rocket',
	'Flamethrower',
	'Minigun',
	'Satchel Charge',
	'Detonator',
	'Spraycan',
	'Fire Extinguisher',
	'Camera',
	'Night Vision Goggles',
	'Thermal Goggles',
	'Parachute',
	'Cellphone',
	'Jetpack',
	'Skateboard'
];
util.weaponNames[GAME_GTA_IV] = [
	'UNARMED Fist',
	'BASEBALLBAT w_bat',
	'POOLCUE w_cue',
	'KNIFE w_knife',
	'GRENADE w_grenade',
	'MOLOTOV w_molotov',
	'ROCKET cj_rpg_rocket',
	'PISTOL w_glock',
	'UNUSED0',
	'DEAGLE w_eagle, w_e2_eagle(TBOGT only)',
	'SHOTGUN w_pumpshot',
	'BARETTA w_shotgun',
	'MICRO_UZI w_uzi',
	'MP5 w_mp5',
	'AK47 w_ak47',
	'M4 w_m4',
	'SNIPERRIFLE w_psg1',
	'M40A1 w_rifle',
	'RLAUNCHER rpg',
	'FTHROWER',
	'MINIGUN',
	'Grenade Launcher',
	'w_e1_sweeper(TLAD)',
	'',
	'w_e1_cuehalf(TLAD)',
	'grenade',
	'w_sawnoff(TLAD)',
	'w_cz75(TLAD)',
	'w_pipebomb(TLAD)',
	'w_44amag(TBoGT)',
	'w_e2_aa12_exp(TBoGT)',
	'w_e2_aa12(TBoGT)',
	'w_e2_p90(TBoGT)',
	'w_e2_uzi(TBoGT)',
	'w_e2_m249(TBoGT)',
	'w_e2_dsr1(TBoGT)',
	'w_e2_stickybomb(TBoGT)',
	'Buzzard Rocket Launcher(TBoGT)',
	'Buzzard Rockets(TBoGT)',
	'Buzzard Miniguns(TBoGT)',
	'APC Cannons(TBoGT)',
	'Parachute(TBoGT)',
	'EPISODIC_22',
	'EPISODIC_23',
	'EPISODIC_24',
	'CAMERA',
	'OBJECT'
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

// ped
util.getRandomPedModel = function()
{
	for(;;)
	{
		var model = util.rand(util.getMinPedModel(), util.getMaxPedModel());
		if(util._in(util.getInvalidPedModels(), model))
			continue;
		return model;
	}
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
util.findVehicleModel = function(text, defaultVehicleModelId)
{
	if(text === undefined)
		return defaultVehicleModelId;
	
	text = text.trim();
	if(text.length == 0)
		return defaultVehicleModelId;
	
	var textInt = parseInt(text, 10);
	
	var minVehicleModelId = 130;
	var maxVehicleModelId = 236;
	
	if(!isNaN(textInt) && textInt >= minVehicleModelId && textInt <= maxVehicleModelId && !util._in(util.getInvalidVehicleModels(), textInt))
	{
		return textInt;
	}
	
	var vehicleModelNames = util.vehicleModelNames[server.game];
	
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

util.isVehicleModel = (text) =>
{
	return util.findVehicleModel(text) != -1;
};

util.getVehicleModelName = function(vehicleModelId)
{
	return util.vehicleModelNames[server.game][vehicleModelId - util.getMinVehicleModel()];
};






util.getMinObjectModel = () => util.modelRanges[server.game].objects.min;
util.getMaxObjectModel = () => util.modelRanges[server.game].objects.max;
util.getInvalidObjectModels = () => util.modelRanges[server.game].objects.invalid || [];

util.getMinVehicleModel = () => util.modelRanges[server.game].vehicles.min;
util.getMaxVehicleModel = () => util.modelRanges[server.game].vehicles.max;
util.getInvalidVehicleModels = () => util.modelRanges[server.game].vehicles.invalid || [];

util.getMinPedModel = () => util.modelRanges[server.game].peds.min;
util.getMaxPedModel = () => util.modelRanges[server.game].peds.max;
util.getInvalidPedModels = () => util.modelRanges[server.game].peds.invalid || [];

util.getMinBlipModel = () => util.modelRanges[server.game].blips.min;
util.getMaxBlipModel = () => util.modelRanges[server.game].blips.max;
util.getInvalidBlipModels = () => util.modelRanges[server.game].blips.invalid || [];

util.getMinWeapon = () => util.modelRanges[server.game].weapons.min;
util.getMaxWeapon = () => util.modelRanges[server.game].weapons.max;
util.getInvalidWeapons = () => util.modelRanges[server.game].weapons.invalid || [];






// weapon
util.findWeapon = function(text)
{
	var textInt = parseInt(text, 10);
	
	var minWeaponId = util.getMinWeapon();
	var maxWeaponId = util.getMaxWeapon();
	
	if(!isNaN(textInt) && textInt >= minWeaponId && textInt <= maxWeaponId && !util._in(util.getInvalidWeapons(), textInt))
	{
		return textInt;
	}
	
	var weaponNameLower = text.toLowerCase();
	
	for(var weaponId=0; weaponId<util.weaponNames[server.game].length; weaponId++)
	{
		if(util.weaponNames[server.game][weaponId].toLowerCase().indexOf(weaponNameLower) != -1)
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
	return util.weaponNames[server.game][weaponId];
};

util.getWeaponModelId = function(weaponId)
{
	return util.weaponModelIds[weaponId];
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





util.findObjectModel = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = 0;
	var max = 8000;
	
	if(!isNaN(textInt) && textInt >= min && textInt <= max && !util._in(util.getInvalidObjectModels(), textInt))
	{
		return textInt;
	}
	
	return -1;
};

util.isObjectModel = (text) =>
{
	return util.findObjectModel(text) != -1;
};





util.findPedModel = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = 1;
	var max = 195;
	
	if(!isNaN(textInt) && textInt >= min && textInt <= max && textInt != 8 && !util._in(util.getInvalidPedModels(), textInt))
	{
		return textInt;
	}
	
	return -1;
};

util.isPedModel = (text) =>
{
	return util.findPedModel(text) != -1;
};





util.findBlipIcon = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = 0;
	var max = 39;
	
	if(!isNaN(textInt) && textInt >= min && textInt <= max && !util._in(util.getInvalidBlipModels(), textInt))
	{
		return textInt;
	}
	
	return -1;
};

util.isBlipIcon = (text) =>
{
	return util.findBlipIcon(text) != -1;
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
		return count + ' ' + text;
	return count + ' ' + text + 's';
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

