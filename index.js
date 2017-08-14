const Discord = require("discord.js");
const Cleverbot = require("cleverbot-node");
const fs = require('fs');
const http = require('http');
const https = require('https');

let token, characterStats, adjs, commands, filter;

// token = parser("token");
// characterStats = parser("characterStats");
// adjs = parser("adjs");
// commands = parser("commands");
// filter = parser("filter");
token = JSON.parse(fs.readFileSync('./logins.json','utf8'));
characterStats = JSON.parse(fs.readFileSync('./characterStats.json', 'utf8'));
adjs = JSON.parse(fs.readFileSync('./adjs.json','utf8'));
commands = JSON.parse(fs.readFileSync('./commands.json','utf8'));
filter = JSON.parse(fs.readFileSync('./filter.json','utf8'));

const bot = new Discord.Client();
const cbot = new Cleverbot;

//Bot Logins

	bot.login(token.DiscToken);
	cbot.configure({botapi: token.CleverToken});

//Functions

	function random(min, max){
		let rand = Math.floor(Math.random() * (max - min + 1)) + min;
		return rand;
	}

// function parser(variable, file){
// 	var file = file||variable;
// 	var filepath = './'+file+'.json';
// 	fs.access(filepath,'utf8', (err) => {
// 		var obj = err ? JSON.parse(fs.openSync(filepath, 'utf8')) : JSON.parse(fs.readFileSync(filepath,'utf8'));
// 	});
// 	return obj;
// }


//Consts

	const emojiList = ["owo","xd","mew","ethanok"];
	const prefix = ">";

//Bot Ready

	bot.on('ready', () => {
	  console.log('I am ready!');

			// http.get('http://danbooru.donmai.us/posts.json?tags=cake+eating&limit=1&random/', (res) => {
			//   const { statusCode } = res;
			//   const contentType = res.headers['content-type'];

			//   let error;
			//   if (statusCode !== 200) {
			//     error = new Error('Request Failed.\n' +
			//                       `Status Code: ${statusCode}`);
			//   } else if (!/^application\/json/.test(contentType)) {
			//     error = new Error('Invalid content-type.\n' +
			//                       `Expected application/json but received ${contentType}`);
			//   }
			//   if (error) {
			//     console.error(error.message);
			//     // consume response data to free up memory
			//     res.resume();
			//     return;
			//   }

			//   res.setEncoding('utf8');
			//   let rawData = '';
			//   res.on('data', (chunk) => { rawData += chunk; });
			//   res.on('end', () => {
			//     try {
			//       const parsedData = JSON.parse(rawData);
			//       console.log(parsedData);
			//     } catch (e) {
			//       console.error(e.message);
			//     }
			//   });
			// }).on('error', (e) => {
			//   console.error(`Got error: ${e.message}`);
			// });

			// console.log(file);

	});

//Bot on Message

	bot.on("message", message => {
	
//Shorthand initalizer

	let msg = message;
	let cnt = msg.content;
	let mCh = msg.channel;
	let mGu = msg.guild;

//Bot Reject

	if (msg.author.bot) return;

//Check if guild

	if (mGu){
		let guildEmojis = mGu.emojis;
		// let guildArray = Object.keys(filter[mGu.id]);

//Emoji Checker
		for (var i=0;i<emojiList.length;i++){
			if (guildEmojis.find("name",emojiList[i])&&cnt.toLowerCase().includes(emojiList[i])) {
		        	msg.react(guildEmojis.find("name",emojiList[i]));
	        }
		}

//Filter Checker
		if (filter[mGu.id]) {
			for (var i = 0 ; i < Object.keys(filter[mGu.id]).length; i++) {
				if (cnt.includes(Object.keys(filter[mGu.id])[i])){
					msg.delete();
					return;
				}
			}
		}
    }

//Cleverbot Check
		if (msg.mentions.users.first()){
			let args = cnt.split(" ");
			if (args[0].includes(bot.user.id)) {
				let question = args.slice(1).toString();
		    	cbot.write(question, response => {
					mCh.send(response.output);
					return;
				});
			}
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
			let Rich = new Discord.RichEmbed();
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
			Rich.addField("Result" , result);
			mCh.send({embed:Rich});
			return;
		}

//Adjective Generator Command

		if (args[0] == "adj"||args[0] == "adjective"){
			args = args.slice(1);
			let dic =adjs["adjectives"];
			let num = args[0]||1;
			let list;
			let Rich = new Discord.RichEmbed();
			if (num>0&&num<=100){
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
				for (i = 0; i<num;i++){
					let rand = random(0,dic.length);
			        list=list+dic[rand]+"\n\t";
				}
			}
			else{
				if (num>100)
					Rich.addField("ERROR","Please use a smaller number.");
				else
					Rich.addField("ERROR","Please user a bigger number.");
			}

		}

//Invite Command

		if (args[0]== "invite"){
		    let Rich = new Discord.RichEmbed();
			Rich.addField("Add me you your server!", `[Click here!](https://discordapp.com/oauth2/authorize?client_id=285303791937388554&scope=bot&permissions=0)`);
			mCh.send({embed: Rich});
			return;
		}

//Cleverbot
		if (args[0]== "cbot"){
			let question = args.slice(1).toString();
			if (!question){
				mCh.send(`
	This is the cbot command! Use this to talk with the bot. Unfortunately we're using the free API, but if you donate your money to us at `+"`"+`${prefix}support`+"`"+`, perhaps we can upgrade to a higher plan!`);
				return;
			}
			else {
		    	cbot.write(question, (response) => {
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
			//console.log(Array.from(guildEmojis));
			bot.users.get(msg.author.id).send(Array.from(guildEmojis));

//filter
		if (args[0]== "filter"){
			if (!filter[mGu.id]) {
				filter[mGu.id]={};
			}
			if (msg.member.hasPermission("ADMINISTRATOR")&&args[1]=="add"){
				if (!filter[mGu.id][args[2]]) {
					filter[mGu.id][args[2]]=[args[2]];
					fs.writeFile('./filter.json', JSON.stringify(filter), (err) => {if(err) console.error(err)});
				}
			}
			if (args[1]=="list") {
				let list = "Filtered words are:";
				for (var i = 0 ; i < Object.keys(filter[mGu.id]).length; i++) {
					list = list + "\n\t" + Object.keys(filter[mGu.id])[i]
				}
				mCh.send(list);
			}
		}	

		if (args[0]== "custom"){
				args = args.slice(1);
				let command = args[0];
				console.log(command);
				let result = args.slice(1).join(" ");
				console.log(result);
				if (!commands[mGu.id]){
					commands[mGu.id]={};
				}
				commands[mGu.id][command] = {result: result};
				fs.writeFile('./commands.json', JSON.stringify(commands), (err) => {if(err) console.error(err)});
		}

//check if custome command
		if  (mGu)
		if (commands[mGu.id]) {
			if (commands[mGu.id][args[0]]) {
				mCh.send(commands[mGu.id][args[0]].result)
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

		// for (var i = 0; i < Object.keys(commands[mGu.id]).length; i++) {
		// 	let list = commands[mGu.id];
		// 	let command = args[0];
		// 	if (cnt.startsWith(prefix+list[command][i])){
		// 		mCh.send(list[command].result);
		// 	}
		// }
		// console.log(commands[mGu.id][0]);
		// console.log(Object.keys(commands[mGu.id]).length);

//lmgtfy

		if (args[0]== "lmgtfy") {
			let Rich = new Discord.RichEmbed();
			let url = args.slice(1).join("+");
			let query = args.slice(1).join(" ");
			Rich.addField("Let Me Google That For You","["+query+"](http://lmgtfy.com/?q="+url+")");
			mCh.send({embed: Rich});
		}

//Cake

		if (args[0]== "cake") {
			http.get("http://danbooru.donmai.us/posts.json?tags=cake+eating&limit=1&random=true/", (res) => {
 				let rawData = '';
				res.on('data', (chunk) => { rawData += chunk; });
				res.on('end', () => {
				    const parsedData = JSON.parse(rawData);
				    let Rich = new Discord.RichEmbed();
					Rich.setImage(msg.author.displayAvatarURL);
					Rich.setTitle("Cake!");
					Rich.setImage('http://danbooru.donmai.us'+parsedData[0].large_file_url);
					mCh.send({embed: Rich});
				});
			});
		}

//danooru

		if (args[0]== "danbooru"||args[0]== "db") {
			args = args.slice(1);
			let url = "http://danbooru.donmai.us/posts.json?limit=1&random=true&tags="+args.join("+");
			if (args.length > 2) {
			    let Rich = new Discord.RichEmbed();
				Rich.addField("Error","You can only send two tags at a time.");
				mCh.send({embed: Rich});
			}
			else {
				http.get(url, (res) => {
			 				let rawData = '';
							res.on('data', (chunk) => { rawData += chunk; });
							res.on('end', () => {
						    const parsedData = JSON.parse(rawData);
						    let Rich = new Discord.RichEmbed();
						    if (!parsedData[0])
								Rich.addField("Error","No results found.");
							else{
									Rich.setImage('http://danbooru.donmai.us'+ parsedData[0].large_file_url);
									Rich.addField("View in browser","http://danbooru.donmai.us/posts/"+ parsedData[0].id);
									if (parsedData[0].source)
										Rich.addField("Source", parsedData[0].source);
									switch (parsedData[0].rating) {
										case "s":
											Rich.addField("Rating", "Safe");
											break;
										case "q":
											Rich.addField("Rating", "Questionable");
											break;
										case "e":
											Rich.addField("Rating", "Explicit");
											break;
									}
									Rich.addField("Score", (parsedData[0].up_score-parsedData[0].down_score));
									Rich.addField("Favorites", parsedData[0].fav_count);
								}
							mCh.send({embed: Rich});
					});
				});
			}
		}
//gelbooru

		if (args[0]== "gelbooru"||args[0]== "gb") {
			args = args.slice(1);
			let url;
			if (args[0].startsWith("page:")){
				let page = args[0].substring(5);
				args = args.slice(1);
				url = "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&pid="+page+"&tags="+args.join("+");
			}
			else
				url = "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags="+args.join("+");

			https.get(url, (res) => {
 				let rawData = '';
				res.on('data', (chunk) => { rawData += chunk; });
				res.on('end', () => {
	    			let Rich = new Discord.RichEmbed();	
	    			if (rawData!=""){
						let parsedData = JSON.parse(rawData);
						let post = parsedData[random(0,Object.keys(parsedData).length-1)];
						Rich.setImage("https:"+post.file_url);
					}
					else
						Rich.addField("Error","No results found.");
					mCh.send({embed: Rich});						
				});


							    
										// console.log(rawData);
										// Rich.addField("View in browser","http://danbooru.donmai.us/posts/"+ parsedData[0].id);
										// if (parsedData[0].source)
										// 	Rich.addField("Source", parsedData[0].source);
										// switch (parsedData[0].rating) {
										// 	case "s":
										// 		Rich.addField("Rating", "Safe");
										// 		break;
										// 	case "q":
										// 		Rich.addField("Rating", "Questionable");
										// 		break;
										// 	case "e":
										// 		Rich.addField("Rating", "Explicit");
										// 		break;
										// }
										// Rich.addField("Score", (parsedData[0].up_score-parsedData[0].down_score));
									// Rich.addField("Favorites", parsedData[0].fav_count);
			});
		}
// //safebooru

// 		if (args[0]== "safebooru"||args[0]== "sb") {
// 			args = args.slice(1);
// 			let url;
// 			if (args[0].startsWith("page:")){
// 				let page = args[0].substring(5);
// 				args = args.slice(1);
// 				url = "http://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&pid="+page+"&tags="+args.join("+");
// 			}
// 			else
// 				url = "http://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags="+args.join("+");
// 			http.get(url, (res) => {
// 	 				let rawData = '';
// 					res.on('data', (chunk) => { rawData += chunk; });
// 					res.on('end', () => {
// 				    let parsedData = JSON.parse(rawData);
// 				    let post = parsedData[random(0,Object.keys(parsedData).length-1)]
// 				    let Rich = new Discord.RichEmbed();
// 				    if (!post)
// 						Rich.addField("Error","No results found.");
// 					else{
// 							url = "http://safebooru.org//images/"+post.directory+"/"+post.image+"?"+post.id;
// 							console.log(url);
// 							Rich.setImage(url);
// 							// Rich.addField("View in browser","http://danbooru.donmai.us/posts/"+ parsedData[0].id);
// 							// if (parsedData[0].source)
// 							// 	Rich.addField("Source", parsedData[0].source);
// 							// switch (parsedData[0].rating) {
// 							// 	case "s":
// 							// 		Rich.addField("Rating", "Safe");
// 							// 		break;
// 							// 	case "q":
// 							// 		Rich.addField("Rating", "Questionable");
// 							// 		break;
// 							// 	case "e":
// 							// 		Rich.addField("Rating", "Explicit");
// 							// 		break;
// 							// }
// 							// Rich.addField("Score", (parsedData[0].up_score-parsedData[0].down_score));
// 							// Rich.addField("Favorites", parsedData[0].fav_count);
// 						}
// 					mCh.send({embed: Rich});
// 				});
// 			});
// 		}

//is nsfw
		if (args[0]== "isnsfw") {
			let Rich = new Discord.RichEmbed();
			console.log(mCh.nsfw);
			if (mCh.nsfw=false)
				Rich.addField("NSFW Checker!","This channel is NSFW!");
			else
				Rich.addField("NSFW Checker!","This channel is **not** NSFW!");
			mCh.send({embed: Rich});
		}


//Help Command
		if (args[0]== "help") {
			/*bot.users.get(msg.author.id).send(`*/
			let Rich = new Discord.RichEmbed();
			Rich.addField("Ping","Pings the server");
			Rich.addField("Dice",`\`${prefix}dice [amount]\`\nRolls a dice, using a defined amount or the default value of six.`);
			Rich.addField("Flip","Flips a coin.");
			Rich.addField("Character","~~See \`${prefix}char help\` for more details.~~\nCurrently out of commision.");
			Rich.addField("Magic8","\`${prefix}magic8 [question]\` \nAsk the mystical magic 8 ball a question.");
			Rich.addField("Adjective","\`${prefix}adj [amount]\` \nGenerates a certain number of defined adjectives or a default one.");
			Rich.addField("Invite","Posts the link to add the bot to your own server.\n	");
			bot.users.get(msg.author.id).send({embed: Rich});
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