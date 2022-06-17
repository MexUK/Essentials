global.accounts = {};

accounts.pepper = 453785345; // Only change this value when clearing all user accounts.

accounts.path = 'Data/Global/Accounts.xml';

// events
events.bind('onPlayerJoined', (event, client) =>
{
	cd.set(client, 'loggedIn', false);
	cd.set(client, 'registered', accounts.isNameRegistered(client.name));
});

// commands
cmds.register = (client, ...args) =>
{
	var password = args.join(' ');
	
	if(accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username ' + client.name + ' is already registered.');
	
	if(args.length == 0)
		return chat.pm(client, "You didn't type a password.");
	
	accounts.addAccount(client.name, password);
	cd.set(client, 'registered', true);
	chat.all(client.name + " has registered their account.");
};

cmds.login = (client, ...args) =>
{
	var password = args.join(' ');
	
	if(!accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username ' + client.name + ' is not registered.');
	
	if(cd.get(client, 'loggedIn'))
		return chat.pm(client, 'You are already logged in.');
	
	if(args.length == 0)
		return chat.pm(client, "You didn't type a password.");
	
	if(!accounts.isPasswordCorrect(client.name, password))
		return chat.pm(client, "Invalid password.");
	
	cd.set(client, 'loggedIn', true);
	events.trigger('onPlayerLogin', null, client);
	chat.all(client.name + " has logged in.");
};

cmds.logout = (client) =>
{
	if(!accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username ' + client.name + ' is not registered.');
	
	if(!cd.get(client, 'loggedIn'))
		return chat.pm(client, 'You are not logged in.');
	
	cd.set(client, 'loggedIn', false);
	events.trigger('onPlayerLogout', null, client);
	chat.all(client.name + " has logged out.");
};

cmds.accounts = (client) =>
{
	var count = accounts.getAccountCount();
	chat.all('There ' + util.isAre(count) + ' ' + count + ' accounts.');
};









accounts.isClientAuthorized = (client) =>
{
	return !cd.get(client, 'registered') || cd.get(client, 'loggedIn');
};

accounts.isNameRegistered = (name) =>
{
	return xml.attr.get(accounts.path, 'Account', 'name', name, 'name') != null;
};

accounts.addAccount = (name, password) =>
{
	var salt = util.rand(0, 2000000000);
	xml.value.add(accounts.path, 'Account', {
		name:		name,
		password:	accounts.encodePassword(password, salt),
		salt:		salt
	});
};

accounts.isPasswordCorrect = (name, password) =>
{
	var password2 = xml.attr.get(accounts.path, 'Account', 'name', name, 'password');
	if(!password2)
		return false;
	
	var salt = xml.attr.get(accounts.path, 'Account', 'name', name, 'salt');
	if(!salt)
		return false;
	
	if(password2 != accounts.encodePassword(password, salt))
		return false;
	
	return true;
};

accounts.encodePassword = (password, salt) =>
{
	return SHA512(salt + password + accounts.pepper);
};

accounts.getAccountCount = () =>
{
	var count = 0;
	xml.load(accounts.path, 'Account', (v) => count++);
	return count;
};

