// Call all needed Packages
const Seeds = require('./seeds.js');
let seeds = new Seeds();

var fs = require("fs");
const Discord = require("discord.js");
const time = require("moment");
var colors = require('colors');

// Setup Variables 
var client = new Discord.Client();
var config = JSON.parse(fs.readFileSync("config.json"));
config.debug = true;
var botId = "";
var AuthLink = "https://discordapp.com/oauth2/authorize?&client_id="+config.appId+"&scope=bot&permissions=0";
var owner_whitelist = [
	""
]
var bootUpGeneral = client.channels.get('364594803482034179');


console.log("Starting Bot...".bold);


// Single One and Done Actions after the Bot has been started and checked in with the Discord API Servers.
client.on('ready', () => {
	console.log(` Logged in as ${client.user.tag}! `.underline.white.bgCyan);
	
	if(config.debug) {
	console.log("\nMODE CHANGE: Debug Mode Enabled!".red);
	console.log(("DEBUG START TIME: " + timeD() + " = " + client.uptime).red);
		d("Add me to your Server! - " + AuthLink);
	}
	console.log("\n ---- Bot: Online!".white.bgCyan);
	client.user.setGame("... Something");
	botId = config.id;
	
	//bootUpGeneral.send("I'm Alive again!");
});

// Event Listeners
	client.on("guildCreate", guild => {
		// This event triggers when the bot joins a guild.
		client.user.setGame(`with ` + client.users.size + ` Users`);
	});

	client.on("guildDelete", guild => {
		// this event triggers when the bot is removed from a guild.
		client.user.setGame(`with ` + client.users.size + ` Users`);
	});


	client.on("error", error => {
		console.log(error);
	});


	client.on('typingStart', (channel, user) => {
		if(channel.guild) {
			d( timeD() +": "+user.username + " #" + user.discriminator + " is typing in " + channel.guild.name + "/" + channel.name);
		}
		else {
			d( timeD() +": "+user.username + " #" + user.discriminator + " is typing in PMs with the Bot (Me)");
		}
	});
	
	
	
	client.on('message', inMsg => {
		// Selected Auth
		if(is_root(inMsg.author.id)){

		
		}

		// Server Specific Commands
		else if(inMsg.content.toLowerCase() === config.prefix+"h") {
		inMsg.channel.send({embed: {
				color: 3447003,
			title: "Commands for dcss seed bot",
				url: "",
				description: "List of Commands the the Bot Supports",
				fields: [{
					name: "`new seed race background`",
					value: "adds a new seed combo"
				},
				{
					name: "`random`",
					value: "adds a random seed combo"
				},
				{
					name: "`random race background`",
					value: "adds a random seed of the given combo"
				},
				{
					name: "`list`",
					value: "lists all the tracked seeds"
				},
				{
					name: "`kill seed`",
					value: "removes a seed from this list"
				},
				{
					name: "`clear`",
					value: "clears all seeds"
				}
			]
			}});
		}
		
		
		
		// It's good practice to ignore other bots.
		if(inMsg.isPrivate == true) { console.log(`(Private) ${inMsg.author.name}: ${inMsg.content}`); }
		else if(inMsg.author.bot) return;
		else if (!inMsg.guild) { //Checking if it from a server or from a PM
			m(inMsg.author.username + " #" + inMsg.author.discriminator + ": " + inMsg.content); //optional
			//wheretosend.send(message.author.username + ": " + mes); //wheretosend is my variable. Just choose a server and a channel ID
			
			if(!is_root(inMsg.author.id)){ 
				return; // Comment out to Allow for Commands to be Run via the PMs.
			}
		}
		
		
		// Text Based Commands
		//Seed stuff
		//Create a new seed
		else if (inMsg.content.toLowerCase().match(/^!new (\d*) (..) (..)$/)) {
			var match = inMsg.content.toLowerCase().match(/^!new (\d*) (..) (..)$/);
			seeds.new(inMsg,match[1],match[2],match[3]);
		}
		//Create a. new random seed
		else if (inMsg.content.toLowerCase().match(/^!random (..) (..)$/)) {
			var match = inMsg.content.toLowerCase().match(/^!random (..) (..)$/);
			seeds.randomSeed(inMsg,match[1],match[2]);
		}

		else if (inMsg.content.toLowerCase() === config.prefix+"random") {
			seeds.random(inMsg);
		}
		
		//List all active seeds
		else if (inMsg.content.toLowerCase() === config.prefix+"list") {
			seeds.readSeeds(inMsg);
		}
		//Mark a seed inactive
		else if (inMsg.content.toLowerCase().match(/^!kill (\d*)$/)) {
			var match = inMsg.content.toLowerCase().match(/^!kill (\d*)$/);
			seeds.kill(inMsg,match[1]);
		}
		//score a seed
		else if (inMsg.content.toLowerCase() === config.prefix+"score") {
			e(inMsg, "score a seed");
		}

		else if (inMsg.content.toLowerCase() === config.prefix+"clear") {
			seeds.clear(inMsg);
		}
		
	});


// Global Functions
	function e(c, i, o = false) {
		if (i !== "") { c.channel.send(i); } else { console.log("INFO: Called to respond with nothing, Discord can not take Empty Messages!"); }
	}
	function es(i) { client.sendMessage(i); }
	function s(c, i) { if (i !== "") { c.author.send(i); } }
	function c(m){ console.log("INFO: " + m); }
	function d(m) { if(config.debug === true) { console.log(" DEBUG: ".yellow + m.cyan); }}
	function m(m) { if(config.pmmessage === true) { console.log(" MSG: ".yellow + m.cyan); }}
	function timeD() { return time().format('MMMM Do YYYY, h:mm:ss A'); }
	function timeT() { return time().format('MMM DD h:mm A'); }
	function timeUTC() { return time.duration("12:10:12: PM", "HH:mm:ss: A").asSeconds(); }
	function importJson(f){ return JSON.parse(fs.readFileSync(f)); }
	function is_root(i) { return (owner_whitelist.indexOf(i) > -1); }
	
	// https://stackoverflow.com/a/21294619
	function m2ms(i) {
		var m = Math.floor(i / 60000);
		var s = ((i % 60000) / 1000).toFixed(0);
		return m + ":" + (s < 10 ? '0' : '') + s;
	}
	
	// https://stackoverflow.com/a/24137301
	function arraygr (list) {
		return list[Math.floor((Math.random()*list.length))];
	} 


client.login(config.token)
	.then(function() {
		console.log("Authentication Complete!".green);
	}, function(err) {
		console.log('Authentication Failed!'.red);
		c("Error During Authentication!" + " ~ " + JSON.stringify(err));
		client.destroy()
		process.exit();
	});