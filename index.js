const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login("Mjg1MzAzNzkxOTM3Mzg4NTU0.C5QNYQ.EcDHILrnL_QJDGh4a0jDotGR8gs");
var Cleverbot = require('cleverbot-node');
cleverbot = new Cleverbot;
cleverbot.configure({botapi: "CCCpgfy9mKZtR7KY1Y3OeGjsmiw"});

function random(min, max){
	let rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand;
}

const fs = require("fs");
let characterStats = JSON.parse(fs.readFileSync('./characterStats.json', 'utf8'));
let adjs = JSON.parse(fs.readFileSync('./adjs.json','utf8'));
let commands = JSON.parse(fs.readFileSync('./commands.json','utf8'));
const emojiList = ["owo","xd","mew","ethanok"];

const prefix = "!";
bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on("message", message => {
	let msg = message;
	let cnt = msg.content;
	let mCh = msg.channel;

	if (msg.author.bot) return;

//Emoji Checker

	for (var i=0;i<emojiList.length;i++)
		if (msg.guild.emojis.find("name",emojiList[i])&&cnt.toLowerCase().includes(emojiList[i])) {
	        	msg.react(msg.guild.emojis.find("name",emojiList[i]));
        }

//start selector
	if (cnt.startsWith(prefix)){
		let args = cnt.substring(1).split(" ");
		console.log(args);
//Ping Command

		if (args[0] == "ping"){
			console.log("test");
			mCh.send(`pong!`);
			return;
		}

//Dice Command

		if (args[0] == "roll"||args[0] == "dice"){
			val = args.slice(1).toString();
			console.log(val);
			if (typeof val != "number"){
				if (val.startsWith('d')){
					val = Number(val.substring(1));
					if (isNaN(val)){
						mCh.send(`Please use either d[number] or just [number]`);
						return;	
					}
				}
				else{
					val = Number(val);
					console.log(val);
					if (isNaN(val)){
						mCh.send(`Please use either d[number] or just [number]`);
						return;
					}
				}
			}
			let rand = random(1, val);
			msg.reply(`Has rolled a **${rand}**`);
			return;
		}

//Coin FLip Command

		if (args[0] == "flip"){
			rand = random(1, 6000)
			let result;
			switch (true){
				case (rand>1) && (rand<3000):
					result = "Heads";
					break;
				case (rand>3001) && (rand<5999):
					result = "Tails";
					break;
				case (rand === 6000):
					result = "Edge";
				default:
					result = "ERROR";
					break;
			}
			msg.reply(`Flipped and got **${result}**`);
			return;
		}

//Magic 8 Ball Command

		if (cnt.startsWith(prefix + "magic8")){
			
			let question = args.slice(1).toString();
			let rand = random(1, 20);
			let result;
			switch (rand){
				case 1:
					result = "It is certain";
					break;
				case 2:
					result = "It is decidedly so";
					break;
				case 3:
					result = "Without a doubt";	
					break;			
				case 4:
					result = "Yes, definitely";
					break;
				case 5:
					result = "You may rely on it";
					break;
				case 6:
					result = "As I see it, yes";
					break;
				case 7:
					result = "Most likely";
					break;
				case 8:
					result = "Outlook good";
					break;
				case 9:
					result = "Yes";
					break;
				case 10:
					result = "Signs point to yes";
					break;
				case 11:
					result = "Reply hazy try again";
					break;
				case 12:
					result = "Ask again later";
					break;
				case 13:
					result = "Better not tell you now";
					break;
				case 14:
					result = "Cannot predict now";
					break;
				case 15:
					result = "Concentrate and ask again";
					break;
				case 16:
					result = "Don't count on it";
					break;
				case 17:
					result = "My reply is no";
					break;
				case 18:
					result = "My sources say no";
					break;
				case 19:
					result = "Outlook not so good";
					break;
				case 20:
					result = "Very doubtful";
					break;
				default:
					result = "ERROR";
					break;
				}
			mCh.send(`**${result}**`);
			return;
		}

//Adjective Generator Command

		if (args[0] == "adj"||args[0] == "adjective"){
			args = args.slice(1);
			let dic =adjs["adjectives"];
			let num = args[0]||1;
			let list = "";
			if (num>0&&num<=100)
				for (i = 0; i<num;i++){
					let rand = random(0,dic.length);
			        list=list+dic[rand]+"\n\t";
				}
			else{
				if (num>100)
					mCh.send("Please use a smaller number.");
				else
					mCh.send("Please user a bigger number.");
			}

			if (num == 1){
				mCh.send(`\n	
		Your generated adjective is
	**${list}**`);
				return;
			}
			else if (num>1){
				mCh.send(`\n
		Your generated adjectives are
	**${list}**`);
				return;
			}
		}

	//Invite Command

		if (args[0]== "invite"){
				mCh.send(`Use this link to add this bot to your server.
	\n\thttps://discordapp.com/oauth2/authorize?client_id=285303791937388554&scope=bot&permissions=0`);
				return;
		}

	//Cleverbot
		if (args[0]== "cbot"){
			let question = args.slice(1).toString();
			if (!question){
				mCh.send(`
	This is the cleverbot command! Use this to talk with the bot. Unfortunately we're using the free API, but if you donate your money to me on paypal, perhaps we can upgrade to a higher plan!`);
				return;
			}
			else {
		    	cleverbot.write(question, function (response) {
					mCh.send(response.output);
					return;
				});
	    	}
		}

	//All Guilds Command

		if (args[0]=== "guilds"&&msg.author.id=="134201201641127936") {
	            bot.users.get(msg.author.id).send(Array.from(bot.guilds));
	        	//console.log(Array.from(bot.guilds));
	        }

	//List All Emojis Command

		if (args[0]== "emojis")
			//console.log(Array.from(msg.guild.emojis));
			bot.users.get(msg.author.id).send(Array.from(msg.guild.emojis));

	//filter
		if (args[0]== "filter"){
			args = args.slice(1);
			switch (args[0]){
				case "add":
					console.log("add");
					break;
			}
		}

	//custom
		if (args[0]== "custom"){
				args = args.slice(1);
				let command = args[0];
				console.log(command);
				let result = args.slice(1).join(" ");
				console.log(result);
				if (!commands[msg.guild.id]){
					commands[msg.guild.id]={};
				}
				commands[msg.guild.id][command] = {result: result};
				console.log(commands);
				fs.writeFile('./commands.json', JSON.stringify(commands), (err) => {if(err) console.error(err)});
		}

//check if custome command
	if (commands[msg.guild.id]) {
		if (commands[msg.guild.id][args[0]]) {
			mCh.send(commands[msg.guild.id][args[0]].result)
		}
	}

	//avatar
		if (args[0]== "avatar") {
			let Rich = new Discord.RichEmbed();
			if (msg.mentions.users.first())
				Rich.setImage(msg.mentions.users.first().displayAvatarURL);
			else
				Rich.setImage(msg.author.displayAvatarURL);
			mCh.send({embed: Rich});
		}

		// for (var i = 0; i < Object.keys(commands[msg.guild.id]).length; i++) {
		// 	let list = commands[msg.guild.id];
		// 	let command = args[0];
		// 	if (cnt.startsWith(prefix+list[command][i])){
		// 		mCh.send(list[command].result);
		// 	}
		// }
		// console.log(commands[msg.guild.id][0]);
		// console.log(Object.keys(commands[msg.guild.id]).length);

	//Help Command
		if (cnt.startsWith(prefix + "help")){
			bot.users.get(msg.author.id).send(`
	**Ping** \n
		Pings the server.\n
	**Dice** \n
		\`${prefix}dice [amount]\` \n
		Rolls a dice, using a defined amount or the default value of six.\n
	**Flip** \n
		Flips a coin.\n
	**Character**\n
		~~See \`${prefix}char help\` for more details.~~ Currently out of commision.
	**Magic8**\n
		\`${prefix}magic8 [question]\` \n
		Ask the mystical magic 8 ball a question.\n
	**Adjective**\n
		\`${prefix}adj [amount]\` \n
		Generates a certain number of defined adjectives or a default one.\n
	**Invite**\n
		Posts the link to add the bot to your own server.\n	
		`);
			return;
		}
	}
});
// //Character Sheet command
// 	if (cnt.startsWith(prefix + "character")||cnt.startsWith(prefix + "char")) {
// 	    let args = cnt.split(" ").slice(1);
// 	    if (args[0] === "new"){
// 	    	// createProcess++;
// 	        // mCh.send(`Type in your character's name now.`);
// 	//			setTimeout(inputTimeout, 300000);
// 			// userCheck = [`${msg.author.bot}`, `${mCh.id}`];
// 			// lastUsedChannel = mCh.id;
// 			let name = args[1];
// 			characterStats[name] = {name: name, author: msg.author.id};
// 			fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 	   		mCh.send(`New character created. Use \`${prefix}character ${name}\` to view the attributes.`);
// 			return;
// 	    }
// 	    else {
// 	        if (!characterStats[args[0]]) {
// 	            msg.reply(`This character does not exist.`);
// 	        	return;
// 	        }

// 	        else {
// 	        	// name = characterStats.
// 	        	let command = args[1]||"view";
// 	        	let charData = characterStats[args[0]];	
// 	        	let name = charData.name;
//     	       	let desc = charData.desc;
// 	        	let title = charData.title;
// 	        	let stats = charData.stats;
// 	        	let inv = charData.inv;
// 	        	let author = charData.author;
// 	        	if (command==="name"){
// 			        	 name = cnt.split(" ").slice(3).join(" ");
// 			        	characterStats[args[0]]= {name: name, desc: desc, title: title, stats: stats, inv: inv, author: author};
// 						fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 				   		mCh.send(`Stats have been saved.`);
// 			        	return;
// 			        }
// 				if (command==="desc"||command==="description"){
// 			        	 desc = cnt.split(" ").slice(3).join(" ");
// 			        	characterStats[args[0]]= {name: name, desc: desc, title: title, stats: stats, inv: inv, author: author};
// 						fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 				   		mCh.send(`Stats have been saved.`);
// 			        	return;
// 			        }
// 	        	if (command==="title"||command==="titles"){
// 			        	 title = cnt.split(" ").slice(3).join(" ");
// 			        	characterStats[args[0]]= {name: name, desc: desc, title: title, stats: stats, inv: inv, author: author};
// 						fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 				   		mCh.send(`Stats have been saved.`);
// 			        	return;
// 			        }
// 	        	if (command==="stats"){
// 			        	 stats = cnt.split(" ").slice(3).join(" ");
// 			        	characterStats[args[0]]= {name: name, desc: desc, title: title, stats: stats, inv: inv, author: author};
// 						fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 				   		mCh.send(`Stats have been saved.`);
// 			        	return;
// 			        }
// 	        	if (command==="inv"||command==="inventory"){
// 			        	 inv = cnt.split(" ").slice(3).join(" ");
// 			        	characterStats[args[0]]= {name: name, desc: desc, title: title, stats: stats, inv: inv, author: author};
// 						fs.writeFile('./characterStats.json', JSON.stringify(characterStats), (err) => {if(err) console.error(err)});
// 				   		mCh.send(`Stats have been saved.`);
// 			        	return;
// 	        	}
// 	        	if (command==="view"){
// 	        	charData = characterStats[name];
// 	            mCh.send(`\n
// **Name**\n
// ${name}\n
// **Description**\n
// ${charData.desc}\n
// **Titles**\n
// ${charData.title}\n
// **Stats**\n
// ${charData.stats}\n
// **Inventory**\n
// ${charData.inv}\n
// **Author**\n
// ${charData.author}
// \n
// \n
// \n
// Use ${prefix}character ${name} [attribute] [attribute value] to assign info to the attributes.		
// 				`);
// 	        	return;
// 	        	}
// 			}
// 		}
// 	}
// function getdata(char) {
// 	let name = charData.name;
// 	let desc = charData.desc;
// 	let title = charData.title;
// 	let stats = charData.stats;
// 	let inv = charData.inv;
// }

// let caller = msg.author.id;
// let author = charData.author;
// if ((author === caller))