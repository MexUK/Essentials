global.xml = {};

xml.attr = {};
xml.value = {};

/*
xml.attr.set( string path, string root, dictionary matchAllOf, dictionary setAllOf )
*/

// attributes
xml.attr.get = (path, tag, attributeNameMatch, attributeValueMatch, attributeNameFetch, defaultValue) =>
{
	var root = xml.root(path);
	if(!root)
		return defaultValue;
	
	var tagLower = tag.toLowerCase();
	var attributeNameMatchLower = attributeNameMatch.toLowerCase();
	var attributeValueMatchLower = attributeValueMatch.toLowerCase();
	var attributeNameFetchLower = attributeNameFetch.toLowerCase();
	
	for(var i in root.children)
	{
		var tag2 = root.children[i];
		if (tag2.name.toLowerCase() != tagLower)
			continue;
		
		let entry = {};
		for(var attributeName in tag2.attributes)
		{
			let attributeValue = tag2.attributes[attributeName];
			if(attributeNameMatchLower == attributeName.toLowerCase() && attributeValueMatchLower == attributeValue.toLowerCase())
			{
				for(var attributeName2 in tag2.attributes)
				{
					if(attributeNameFetchLower == attributeName2.toLowerCase())
					{
						let attributeValue2 = tag2.attributes[attributeName2];
						return attributeValue2;
					}
				}
				return defaultValue;
			}
		};
	}
	
	return defaultValue;
};

/*
xml.attr.setOLD = (path, tag, attributeNameMatch, attributeValueMatch, attributeNameFetch, attributeValueNew) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	var root2 = doc2.rootElement;
	
	var tagLower = tag.toLowerCase();
	var attributeNameMatchLower = attributeNameMatch.toLowerCase();
	var attributeValueMatchLower = attributeValueMatch.toLowerCase();
	var attributeNameFetchLower = attributeNameFetch.toLowerCase();
	
	for(var i in root2.children)
	{
		var tag2 = root2.children[i];
		if (tag2.name.toLowerCase() != tagLower)
			continue;
		
		let entry = {};
		for(var i2 in tag2.attributes)
		{
			let attributeName = tag2.attributes[i2].name;
			let attributeValue = tag2.attributes[i2].value;
			if(attributeNameMatchLower == attributeName.toLowerCase() && attributeValueMatchLower == attributeValue.toLowerCase())
			{
				for(var i3 in tag2.attributes)
				{
					let attributeName2 = tag2.attributes[i3].name;
					if(attributeNameFetchLower == attributeName2.toLowerCase())
					{
						tag2.attributes[i3].value = attributeValueNew;
						doc2.save(path, root2);
						return true;
					}
				}
				
				tag2.attributes.push(new XmlAttribute2(attributeNameFetch, attributeValueNew));
				doc2.save(path, root2);
				return true;
			}
		};
	}
	
	var element2 = new XmlElement2();
	element2.name = tag;
	element2.attributes.push(new XmlAttribute2(attributeNameMatch, attributeValueMatch));
	element2.attributes.push(new XmlAttribute2(attributeNameFetch, attributeValueNew));
	root2.children.push(element2);
	
	doc2.save(path, root2);
	return true;
};
*/

xml.attr.remove = (path, tag, attributeNameMatch, attributeValueMatch, attributeNameRemove) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	var root2 = doc2.rootElement;
	
	var tagLower = tag.toLowerCase();
	var attributeNameMatchLower = attributeNameMatch.toLowerCase();
	var attributeValueMatchLower = attributeValueMatch.toLowerCase();
	var attributeNameRemoveLower = attributeNameRemove.toLowerCase();
	
	for(var i in root2.children)
	{
		var tag2 = root2.children[i];
		if (tag2.name.toLowerCase() != tagLower)
			continue;
		
		let entry = {};
		for(var i2 in tag2.attributes)
		{
			let attributeName = tag2.attributes[i2].name;
			let attributeValue = tag2.attributes[i2].value;
			if(attributeNameMatchLower == attributeName.toLowerCase() && attributeValueMatchLower == attributeValue.toLowerCase())
			{
				for(var i3 in tag2.attributes)
				{
					let attributeName2 = tag2.attributes[i3].name;
					if(attributeNameRemoveLower == attributeName2.toLowerCase())
					{
						tag2.attributes.splice(i3, 1);
						doc2.save(path, root2);
						return true;
					}
				}
			}
		};
	}
};

xml.attr.set = (path, tag, matchAttributes, newAttributes) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	var root2 = doc2.rootElement;
	
	var tagLower = tag.toLowerCase();
	var attributesSet = {};
	
	for(var i in root2.children)
	{
		var tag2 = root2.children[i];
		if (tag2.name.toLowerCase() != tagLower)
			continue;
		
		var attr = {};
		for(var i2 in tag2.attributes)
			attr[tag2.attributes[i2].name.toLowerCase()] = tag2.attributes[i2].value.toLowerCase();
		
		var totalCount = 0;
		var matchCount = 0;
		for(var k in matchAttributes)
		{
			if(attr[k.toLowerCase()] == (matchAttributes[k] + '').toLowerCase())
			{
				matchCount++;
			}
			totalCount++;
		}
		if(totalCount != matchCount)
			continue;
		
		for(var i2 in tag2.attributes)
		{
			var nameLower = tag2.attributes[i2].name.toLowerCase();
			if(newAttributes[nameLower] !== undefined)
			{
				tag2.attributes[i2].value = newAttributes[nameLower].toString();
				attributesSet[nameLower] = true;
			}
		}
		
		for(var k in newAttributes)
		{
			if(attributesSet[k.toLowerCase()])
				continue;
			
			tag2.attributes.push(new XmlAttribute2(k, newAttributes[k]));
		}
		
		doc2.save(path, root2);
		return true;
	}
	
	var element2 = new XmlElement2();
	element2.name = tag;
	for(var k in matchAttributes)
		element2.attributes.push(new XmlAttribute2(k, matchAttributes[k]));
	for(var k in newAttributes)
		element2.attributes.push(new XmlAttribute2(k, newAttributes[k]));
	root2.children.push(element2);
	
	doc2.save(path, root2);
	return true;
};

xml.attr.remove2 = (path, tag, matchAttributes) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	var root2 = doc2.rootElement;
	
	var tagLower = tag.toLowerCase();
	
	for(var i in root2.children)
	{
		var tag2 = root2.children[i];
		if (tag2.name.toLowerCase() != tagLower)
			continue;
		
		var attr = {};
		for(var i2 in tag2.attributes)
			attr[tag2.attributes[i2].name.toLowerCase()] = tag2.attributes[i2].value.toLowerCase();
		
		var totalCount = 0;
		var matchCount = 0;
		for(var k in matchAttributes)
		{
			if(attr[k.toLowerCase()] == matchAttributes[k].toString().toLowerCase())
			{
				matchCount++;
			}
			totalCount++;
		}
		if(totalCount != matchCount)
			continue;
		
		root2.children.splice(i, 1);
		
		doc2.save(path, root2);
		return true;
	}
	
	return false;
};

// values
xml.value.get = (path, tag) =>
{
	tag = tag.toLowerCase();
	
	var root = xml.root(path);
	if(!root)
		return '';
	
	for(var i in root.children)
	{
		var tag2 = root.children[i];
		if (tag2.name.toLowerCase() != tag)
			continue;
		
		return tag2.text;
	}
	
	return '';
};

xml.value.set = (path, tag, value) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	
	var tagLower = tag.toLowerCase();
	var root2 = doc2.rootElement;
	for(var i in root2.children)
	{
		var element2 = root2.children[i];
		if (element2.name.toLowerCase() != tagLower)
			continue;
		
		element2.value = value + "";
		
		doc2.save(path, root2);
		return true;
	}
	
	var element2 = new XmlElement2();
	element2.name = tag;
	element2.value = value;
	root2.children.push(element2);
	
	doc2.save(path, root2);
	return true;
};

xml.value.remove = (path, tag, attributeName, attributeValue) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	
	var tagLower = tag.toLowerCase();
	var attributeNameLower = attributeName.toLowerCase();
	var root2 = doc2.rootElement;
	for(var i in root2.children)
	{
		var element2 = root2.children[i];
		if (element2.name.toLowerCase() != tagLower)
			continue;
		
		var attributeValueMatch = false;
		for(var i2 in element2.attributes)
		{
			if(attributeNameLower == element2.attributes[i2].name.toLowerCase() && attributeValue.toString() == element2.attributes[i2].value)
			{
				attributeValueMatch = true;
			}
		}
		if(!attributeValueMatch)
			continue;
		
		root2.children.splice(i, 1);
		doc2.save(path, root2);
		return true;
	}
	
	return false;
};

xml.value.add = (path, tag, attributes, value) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	
	var root2 = doc2.rootElement;
	var element2 = new XmlElement2();
	element2.name = tag;
	for(var k in attributes)
		element2.attributes.push(new XmlAttribute2(k, attributes[k]));
	if(value !== undefined && value !== null && value !== '')
		element2.value = value;
	root2.children.push(element2);
	
	doc2.save(path, root2);
	return true;
};

// file
xml.load = (path, tag, callback) =>
{
	var doc2 = xml.doc2(path);
	if(!doc2)
		doc2 = new XmlDocument2();
	
	var tagLower = tag.toLowerCase();
	var root2 = doc2.rootElement;
	
	for(var i in root2.children)
	{
		var element2 = root2.children[i];
		if (element2.name.toLowerCase() != tagLower)
			continue;
		
		var attributes = {};
		for(var k in element2.attributes)
			attributes[element2.attributes[k].name] = element2.attributes[k].value;
		
		callback(attributes);
	}
};

xml.save = (path, tag, data, attributes) =>
{
	var doc2 = new XmlDocument2();
	var root2 = doc2.rootElement;
	
	for(var i in data)
	{
		var element = new XmlElement2();
		element.name = tag;
		for(var i2 in attributes)
		{
			var value = data[i][attributes[i2]];
			if(attributes[i2] == 'rotation')
				value = util.rotArray(value, true);
			else if(attributes[i2] == 'heading')
				value = util.degrees(value);
			value = util.toString(value);
			element.attributes[i2] = new XmlAttribute2(attributes[i2], value);
		}
		root2.children[i] = element;
	}
	
	doc2.save(path, root2);
};

// utility
xml.root = (path) =>
{
	var file = openFile(path);
	if(!file)
	{
		return null;
	}
	
	var xml = new XmlDocument();
	xml.load(file);
	
	var root = xml.rootElement;
	file.close();
	return root;
};

xml.root2 = (path) =>
{
	var file = openFile(path);
	if(!file)
	{
		return null;
	}
	
	var xml = new XmlDocument2();
	xml.load(file);
	
	var root = xml.rootElement;
	return root;
};

xml.doc2 = (path) =>
{
	var file = openFile(path);
	if(!file)
	{
		return null;
	}
	
	var doc2 = new XmlDocument2();
	doc2.load(file);
	
	return doc2;
};

global.XmlDocument2 = function()
{
	this.rootElement = new XmlElement2();
	this.rootElement.name = 'Root';
	
	this.load = (file) =>
	{
		var xml = new XmlDocument();
		xml.load(file);
		
		var root = xml.rootElement;
		file.close();
		if(!root)
		{
			this.rootElement = new XmlElement2();
			this.rootElement.name = 'Root';
			return;
		}
		
		var root2 = new XmlElement2();
		root2.name = root.name;
		
		for(var i in root.children)
		{
			var element = root.children[i];
			
			var element2 = new XmlElement2();
			element2.name = element.name;
			element2.value = element.text;
			var i2 = 0;
			for(var attributeName in element.attributes)
			{
				element2.attributes[i2] = new XmlAttribute2(attributeName, element.attributes[attributeName]);
				i2++;
			}
			
			root2.children[i] = element2;
		}
		
		this.rootElement = root2;
	};
	
	this.save = (path, root) =>
	{
		var lines = [];
		
		var str = '<';
		str += root.name;
		for(var i in root.attributes)
			str += " " + root.attributes[i].name + "=\"" + root.attributes[i].value + "\"";
		str += ">";
		lines.push(str);
		
		for(var i in root.children)
		{
			var element = root.children[i];
			
			str = "\t" + '<';
			str += element.name;
			for(var i2 in element.attributes)
				str += " " + element.attributes[i2].name + "=\"" + element.attributes[i2].value + "\"";
			if(element.value === undefined || element.value === null || element.value === '')
			{
				str += ' />';
			}
			else
			{
				str += ">";
				str += element.value;
				str += '</';
				str += element.name;
				str += ">";
			}
			
			lines.push(str);
		}
		
		str = '</';
		str += root.name;
		str += ">";
		lines.push(str);
		
		saveTextFile(path, lines.join("\r\n"));
	};
};

global.XmlElement2 = function()
{
	this.children = [];
	this.name = '';
	this.attributes = [];
};

global.XmlAttribute2 = function(name, value)
{
	this.name = name;
	this.value = value;
};

