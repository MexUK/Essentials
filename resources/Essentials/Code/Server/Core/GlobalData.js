global.gd = {};

gd.data = {};

gd.path = 'Data/Global/ServerData.xml';
gd.rootTag = 'Server';

// string
gd.set = (name, value) =>
{
	gd.data[name] = value;
};

gd.setAll = (values) =>
{
	for(var name in values)
		gd.data[name] = values[name];
};

gd.unset = (name) =>
{
	delete gd.data[name];
};

gd.get = (name) =>
{
	return gd.data[name];
};

gd.has = (name) =>
{
	return gd.data[name] !== undefined;
};

// string + disk
gd.save = (saveData) =>
{
	for(var k in saveData)
		gd.data[k] = saveData[k];
	xml.attr.set(gd.path, gd.rootTag, null, saveData);
};

gd.load = () =>
{
	gd.setAll(xml.attr.getAll(gd.path, gd.rootTag, null));
};

// load
{
	setImmediate(gd.load);
}