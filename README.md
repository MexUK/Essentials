# Essentials Resource
This resource, named Essentials, is for GTA:Connected multiplayer (GTAC).

This resource works with III, VC, and SA.  Please note, this resource does not work with IV.

Over 200 commands are available to use, and a mapper is included.

<hr>

##### Getting Started

1. Click the green Code button then click Download ZIP at this URL: https://github.com/MexUK/Essentials

2. Open the downloaded zip and extract Essentials-main to somewhere on your computer.

3. Download the server files from this URL: https://gtaconnected.com/downloads/

4. Open the downloaded zip and extract the following 4 files into your Essentials-main folder:<br/>
Server.exe<br/>
mozglue_x86.dll<br/>
mozjs-52_x86.dll<br/>
nspr4_x86.dll

##### Creating a Level 10 Admin Account

Note: In this resource, accounts are the same for all games, but admin levels are per game.<br/>
Note: This stage only needs to occur once.

1. Start the server, by running Server.exe.

2. Register your account when in-game by typing /register password

3. Now stop the server, by closing the server console.

4. Add your username and level to the admin XML file.

File Path: Essentials-main\resources\Essentials\Data\VC\Players.xml

File Data:
```xml
<Root>
	<Player name="Mex" level="10" />
</Root>
```

Note: Choose the applicable game folder in the file path. (Either III, VC, SA.)<br/>
Note: Change the username Mex to your username which you chose in the GTAC launcher.

5. The server is now ready to start (again), and your admin account should now be setup.

##### Change a Player's Admin Level

1) When in-game, type: /setlevel name level

e.g. /setlevel PlayerName 9

##### View All Commands

When in-game, type either /commands or /cmds.

Also see Essentials Commands.txt in the Essentials-main folder.

