global.accounts = {};

accounts.pepper = 453785345; // Only change this value when clearing all user accounts.

accounts.path = 'data/scripts/accounts/Accounts.xml';

// events
events.onPlayerJoined.push((event, client) =>
{
	clientData.set(client, 'loggedIn', false);
	clientData.set(client, 'registered', accounts.isNameRegistered(client.name));
});

// commands
cmds.register = (client, _password) =>
{
	if(accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username is already registered.');
	
	if(_password === undefined)
		return chat.pm(client, "You didn't type a password.");
	
	accounts.addAccount(client.name, _password);
	clientData.set(client, 'registered', true);
	chat.all(client.name + " has registered their account.");
};

cmds.login = (client, _password) =>
{
	if(!accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username is not registered.');
	
	if(clientData.get(client, 'loggedIn'))
		return chat.pm(client, 'You are already logged in.');
	
	if(_password === undefined)
		return chat.pm(client, "You didn't type a password.");
	
	if(!accounts.isPasswordCorrect(client.name, _password))
		return chat.pm(client, "Invalid password.");
	
	clientData.set(client, 'loggedIn', true);
	chat.all(client.name + " has logged in.");
};

cmds.logout = (client) =>
{
	if(!accounts.isNameRegistered(client.name))
		return chat.pm(client, 'Username is not registered.');
	
	if(!clientData.get(client, 'loggedIn'))
		return chat.pm(client, 'You are not logged in.');
	
	clientData.set(client, 'loggedIn', false);
	chat.all(client.name + " has logged out.");
};









accounts.isNameRegistered = (name) =>
{
	return xml.getAttr(accounts.path, 'Account', 'name', name, 'name') != null;
};

accounts.addAccount = (name, password) =>
{
	var salt = util.rand(0, 2000000000);
	xml.add(accounts.path, 'Account', {
		name:		name,
		password:	accounts.encodePassword(password, salt),
		salt:		salt
	});
};

accounts.isPasswordCorrect = (name, password) =>
{
	var password2 = xml.getAttr(accounts.path, 'Account', 'name', name, 'password');
	if(!password2)
		return false;
	
	var salt = xml.getAttr(accounts.path, 'Account', 'name', name, 'salt');
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

