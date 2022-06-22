global.cmds = {};

/*
global.loadExports = (resourceName, globalNames) =>
{
	let resource = findResourceByName(resourceName);
	if(!resource)
	{
		console.log('[EssentialsCore] [Export Loading] Resource '+resourceName+ ' not found!');
		return;
	}
	
	for(let k in resource.exports)
	{
		for(let i in globalNames)
		{
			let globalName = globalNames[i];

			if(k.substr(0, globalName.length + 1) == globalName+'_')
			{
				let parts = k.split('_');
				let obj = global;
				let j2 = parts.length;
				for(let i2=0; i2<(j2 - 1); i2++)
				{
					let part = parts[i2];
					if(!obj[part])
					{
						obj[part] = {};
					}
					obj = obj[part];
				}
				obj[parts[parts.length - 1]] = resource.exports[k];
				break;
			}
		}
	}
};

loadExports('EssentialsCore', ['util', 'events', 'chat', 'cd', 'xml']);
*/

