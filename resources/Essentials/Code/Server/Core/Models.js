global.util = global.util || {};

util.modelRanges = [];
util.vehicleModelNames = [];
util.weaponNames = [];
util.weaponModelIds = [];
util.drownWeaponIds = [];
util.impactWeaponIds = [];
util.pedPieceNames = [];





util.modelRanges[GAME_GTA_III] = {};
util.modelRanges[GAME_GTA_VC] = {};
util.modelRanges[GAME_GTA_SA] = {};
util.modelRanges[GAME_GTA_IV] = {};

util.modelRanges[GAME_GTA_III].objects = { min: 0, max: 8000 };
util.modelRanges[GAME_GTA_III].vehicles = { min: 90, max: 150 };
util.modelRanges[GAME_GTA_III].blips = { min: 0, max: 20 };
util.modelRanges[GAME_GTA_III].peds = { min: 1, max: 126, invalid: [26, 27, 28, 29] };
util.modelRanges[GAME_GTA_III].weapons = { min: 0, max: 12 };

util.modelRanges[GAME_GTA_VC].objects = { min: 258, max: 5000 };
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






util.weaponModelIds[GAME_GTA_III] = [];
util.weaponModelIds[GAME_GTA_VC] = [
	0,   259, 260, 261, 262, 263, 264, 265, 266, 267,
	268, 269, 270, 291, 271, 272, 273, 274, 275, 277,
	278, 279, 281, 282, 283, 284, 280, 276, 285, 286,
	287, 288, 289, 290
];
util.weaponModelIds[GAME_GTA_SA] = [];
util.weaponModelIds[GAME_GTA_IV] = [];


util.drownWeaponIds[GAME_GTA_III] = 43;
util.drownWeaponIds[GAME_GTA_VC] = 43;
util.drownWeaponIds[GAME_GTA_SA] = 43;
util.drownWeaponIds[GAME_GTA_IV] = 0;

util.impactWeaponIds[GAME_GTA_III] = 37;
util.impactWeaponIds[GAME_GTA_VC] = 37;
util.impactWeaponIds[GAME_GTA_SA] = 37;
util.impactWeaponIds[GAME_GTA_IV] = 0;

util.pedPieceNames[GAME_GTA_III] = [
	'Left Knee',
	'Torso',
	'Head',
	'Left Arm',
	'Right Arm',
	'Left Hand',
	'Right Hand',
	'Left Leg',
	'Right Leg',
	'Left Foot',
	'Right Foot',
	'Right Knee'
];
util.pedPieceNames[GAME_GTA_VC] = [
	'Left Knee',
	'Torso',
	'Head',
	'Left Arm',
	'Right Arm',
	'Left Hand',
	'Right Hand',
	'Left Leg',
	'Right Leg',
	'Left Foot',
	'Right Foot',
	'Right Knee',
	'Left Knee',
	'Left Elbo',
	'Right Elbo',
	'Neck'
];
util.pedPieceNames[GAME_GTA_SA] = [
	null,
	null,
	null,
	'Torso',
	'Ass',
	'Left Arm',
	'Right Arm',
	'Left Leg',
	'Right Leg',
	'Head',
];




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
	'',
	'',
	'',
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
	'Parachute'//,
	//'Cellphone',
	//'Jetpack',
	//'Skateboard'
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

// object
util.findObjectModel = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = util.getMinObjectModel();
	var max = util.getMaxObjectModel();
	
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

util.getRandomObjectModel = function()
{
	for(;;)
	{
		var model = util.rand(util.getMinObjectModel(), util.getMaxObjectModel());
		if(util._in(util.getInvalidObjectModels(), model))
			continue;
		return model;
	}
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
	
	var minVehicleModelId = util.getMinVehicleModel();
	var maxVehicleModelId = util.getMaxVehicleModel();
	
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

util.getRandomVehicleModel = function()
{
	for(;;)
	{
		var model = util.rand(util.getMinVehicleModel(), util.getMaxVehicleModel());
		if(util._in(util.getInvalidVehicleModels(), model))
			continue;
		return model;
	}
};

// ped
util.findPedModel = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = util.getMinPedModel();
	var max = util.getMaxPedModel();
	
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

// blip
util.findBlipIcon = function(text)
{
	var textInt = parseInt(text, 10);
	
	var min = util.getMinBlipModel();
	var max = util.getMaxBlipModel();
	
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

util.getRandomBlipModel = function()
{
	for(;;)
	{
		var model = util.rand(util.getMinBlipModel(), util.getMaxBlipModel());
		if(util._in(util.getInvalidBlipModels(), model))
			continue;
		return model;
	}
};

// weapon
util.getInvalidWeaponModels = () => [];

util.findWeapon = function(text)
{
	if(text === undefined || text === null)
		return -1;
	
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
	return util.weaponModelIds[server.game][weaponId];
};

util.getRandomWeapon = function()
{
	for(;;)
	{
		var model = util.rand(util.getMinWeaponModel(), util.getMaxWeaponModel());
		if(util._in(util.getInvalidWeaponModels(), model))
			continue;
		return model;
	}
};

{
	util.exportAll('util', util);
}