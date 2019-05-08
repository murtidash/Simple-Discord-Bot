var fs = require('fs');
var util = require('util');


class Seed {
	constructor(seed,race,background, user) {
		this.seed=seed;
		this.race=race;
		this.background=background;
		this.user=user;
		this.date=new Date();
	}
	get getSeed() {
		return this.seed;
	}
	get getRace() {
		return this.race;
	}
	get getBackground() {
		return this.background;
	}
}

class Seeds {

	race() {
		let races = [
			"ba","ce","dd","de","dg","ds","dr","fe","fo","gr","gh","gn","ha","ho","hu","ko","mf","mi","mu","na","op","og","sp","te","tr","vp","vs"
		];
		return races[Math.floor(Math.random()*races.length)];
	}

	background() {
		let backgrounds = [
			"fi","gl","mo","hu","as","be","ak","ck","sk","en","tm","am","wr","wz","cj","su","ne","fe","ie","ae","ee","vm","ar","wn"
		];
		return backgrounds[Math.floor(Math.random()*backgrounds.length)];
	}

	random(inMsg) {
		inMsg.channel.send("Creating new random seed");
		let newSeed = new Seed(
			Math.floor(Math.random()*1000000000000).toString(),
			this.race(),
			this.background(),
			inMsg.author.username
		);
		inMsg.channel.send(newSeed.seed + ' : ' + newSeed.race + newSeed.background);
		this.writeSeed(newSeed);
	}

	new(inMsg, seed, race, background) {		
		console.log(util.inspect(inMsg.author.username));
		let newSeed = new Seed(seed,race,background,inMsg.author.username);
		inMsg.channel.send("New Seed added by "+newSeed.user+"!\n" + newSeed.seed + " : " + newSeed.race+newSeed.background);
		this.writeSeed(newSeed);

	}
	writeSeed(seed) {
		var seeds = require('./seeds.json');
		var update = false;
		for (var i=0;i<seeds.length;i++) {
			if(seeds[i].seed === seed.seed) {
				seeds[i] = seed;
				update=true;
			}
		}
		if (!update) {
			seeds.push(seed);
		}
		console.log(seeds);
		fs.writeFile('seeds.json',JSON.stringify(seeds),'utf8', function() {});
	}

	readSeeds(inMsg) {
		var seeds = require('./seeds.json');
		inMsg.channel.send(JSON.stringify(seeds));
	}

	kill(inMsg,seed) {
		var seeds = require('./seeds.json');
		console.log(util.inspect(seeds));
		for (var i=0;i<seeds.length;i++) {
			if(seeds[i].seed === seed) {
				seeds.splice(i,1);
			}
		}
		console.log(util.inspect(seeds));
		fs.writeFile('seeds.json',JSON.stringify(seeds),'utf8',function() {});
	}

}


module.exports = Seeds;