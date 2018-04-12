//Documentations
//https://dijs.github.io/wiki/index.html
//https://www.npmjs.com/package/popura
//https://timezonedb.com/references/list-time-zone

const Discord = require("discord.js");
const Cleverbot = require("cleverbot-node");
const fs = require('fs');
const http = require('http');
const https = require('https');
const convert = require('xml-js');
const wiki = require('wikijs').default;
const popura = require('popura');
const mal = popura('Kisatoto', 'blackmicrophoneglasses890');

let token, characterStats, adjs, commands, filter, serverSettings;

token = parser("token","logins");
characterStats = parser("characterStats");
adjs = parser("adjs");
commands = parser("commands");
filter = parser("filter");
// serverSettings = parser("filter");

const bot = new Discord.Client();
const cbot = new Cleverbot;

//Bot Logins


	bot.login(token.DiscToken);
	cbot.configure({botapi: token.CleverToken});

//Bot Ready
bot.on('guildMemberAdd', member => {
	member.guild.defaultChannel.send(member+" has joined the server.");
});


bot.on('ready', () => {
	console.log('I am ready!');
	bot.user.setActivity("you fap.",{type:"WATCHING"});
});

//Consts

const prefix = ">";

//Functions

//random number generator

function random(min, max){
	let rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand;
}

//file parser
function parser(variable, file){
	var file = file||variable;
	var filepath = './'+file+'.json';
	try{
		let check = "";
		var obj = JSON.parse(fs.readFileSync(filepath, 'utf8', function (err) {
			check += " not"
		}));
		console.log(filepath+" parsed!")
	}
	catch (err){
		fs.writeFile(filepath, "{}", { flag: 'wx' }, function (err) {
		});
		console.log(filepath+" created!")
	}
	return obj;
}

//site donlader
function siteDown(site,secure,args,channel){
	let url;
	if (secure)
		url="https://"+site+"/index.php?page=dapi&s=post&q=index&json=1&";
	else
		url="http://"+site+"/index.php?page=dapi&s=post&q=index&json=1&";

	if (args[0].startsWith("page:")){
		let page = args[0].substring(5);
		args = args.slice(1);
		url += "pid="+page+"&tags="+args.join("+");
	}
	else
		url += "tags="+args.join("+");
	if (secure)
		https.get(url, (res) => {
			down(res, site, secure, channel);
		});
	else
		http.get(url, (res) => {
			down(res, site, secure, channel);
		});
}

//image poster
function down(res, site, secure, channel){
	let rawData = '';
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		let Rich = new Discord.RichEmbed();	
		if (rawData!=""){
			let parsedData = JSON.parse(rawData);
			let post = parsedData[random(0,Object.keys(parsedData).length-1)];
			if (secure)
				Rich.setImage("https://"+site+"/images/"+post.directory+"/"+post.image);
			else
				Rich.setImage("http://"+site+"/images/"+post.directory+"/"+post.image);
		}
		else
			Rich.addField("Error","No results found.");
		channel.send({embed: Rich});						
	});
}

function imageItem(title, args, channel){
	http.get("http://safebooru.donmai.us/posts.json?api_key=rWOnqbmk1Pwqs3AYBb1_gklj8b9uOUE5e-GeUzgARGA&tags="+args+"&limit=1&random=true/", (res) => {
			let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
		    const parsedData = JSON.parse(rawData);
		    let Rich = new Discord.RichEmbed();
			Rich.setTitle(title);
			if (!parsedData[0].large_file_url.startsWith("http"))
				Rich.setImage('http://danbooru.donmai.us'+ parsedData[0].large_file_url);
			else
				Rich.setImage(parsedData[0].large_file_url);
			channel.send({embed: Rich});
		});
	});
}


function smug(mCh){
	var Rich = new Discord.RichEmbed();
	var options = {
	  hostname: 'smugs.safe.moe',
	  path: '/api/v1/i/r',
	  method: 'GET',
	};

	var req = https.request(options, (res) => {
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;;
	 	});
		res.on('end', () => {
	    	const parsedData = JSON.parse(rawData);
	    	Rich.setImage("https://smugs.safe.moe/"+parsedData.url);
			mCh.send({embed: Rich});
		});
	});

	req.on('error', (e) => {
	  console.error(`problem with request: ${e.message}`);
	});

	req.end();
}


//Bot on Message

bot.on("message", message => {
	
//Shorthand initalizer
	let Rich = new Discord.RichEmbed();
	let msg = message;
	let cnt = msg.content;
	let mCh = msg.channel;
	let mGu = msg.guild;
	// let guildArray = Object.keys(filter[mGu.id]);
	Rich.color = 13685458;

//Bot Reject

	if (msg.author.bot) return;

//Cleverbot Check
		if (msg.mentions.users.first()){
			Rich.setAuthor(msg.member.displayName,msg.author.displayAvatarURL);
			console.log("burp");
			let args = cnt.split(" ");
			if (args[0].includes(bot.user.id)) {
				let question = args.slice(1).join(" ");
		    	cbot.write(question, response => {
		    		mCh.startTyping();
					setTimeout(()=> {
						mCh.stopTyping()
						Rich.setDescription("💬 "+response.output);
						Rich.addField("Say \``STOP\`` at any time to end the conversation.")
						mCh.send({embed:Rich});
					},100*response.output.length);
					var timer = setTimeout(() => {
						collector.stop();
					},60000);
					let collector = mCh.createMessageCollector(
						message => (message.author==msg.author)
					);
					collector.on('collect', item => {
						args = item.content.split(" ");
						question = item.content;
						if (question == "STOP"){
							collector.stop();
							item.channel.send("CB Stopped.")
							return;
						}
						else if (args[0].includes(bot.user.id)){
							item.channel.send("CB restarted.")
							collector.stop();
						}
						else
			    			cbot.write(question, response => {
					    		mCh.startTyping();
								setTimeout(()=> {
									item.channel.stopTyping()
									Rich.setDescription("💬 "+response.output);
									item.channel.send({embed:Rich});
								},100*response.output.length);
								clearTimeout( timer );
								timer = setTimeout(() => {
									collector.stop();
								},60000);
							});
					});
				});
			}
		}

//Start Selector
	if (cnt.startsWith(prefix)){
		let args = cnt.substring(1).split(" ");
		console.log(args);

//Ping Command

		if (args[0] == "ping"){
			let time =  Date.now();
			let message;
			mCh.send(`pong!`).then(recieve => {
				Rich.setTitle("Ping!")
				Rich.setAuthor("Ranko",bot.user.displayAvatarURL);
				Rich.setDescription("Pong! That took " +(Date.now()-time)+"ms!");
				recieve.edit("",Rich);
			});
			return;
		}

//Choose

		if (args[0] == "choose"){
			args = args.slice(1).join(" ");
			args = args.split("|");
			// let outcome = 
			mCh.send("Your choice is: \`" + (args[random(1,args.length)-1])+"\`");
			return;		
		}

//scp

		if (args[0] == "scp"){
			args = args.slice(1);
			let num = "";
			if (args[0]){
				if (!isNaN(args[0])&&(parseInt(args[0])>0)&&(parseInt(args[0])<4001))
					num = args[0];
				else{
					mCh.send("Error, that is not a valid SCP.");
					return;
				}
			}
			else
				num += random(1,3000);
			for (var i = num.length; i < 3; i++)
				num = "0" + num;
			mCh.send("http://www.scp-wiki.net/scp-"+num);
			return;		
		}

//wiki

		if (args[0] == "wiki"){
			Rich.setAuthor("Wikipedia","https://en.wikipedia.org/static/images/project-logos/enwiki.png","https://en.wikipedia.org/wiki/Main_Page");
			args = args.slice(1);
			if (args[0] == "search"){
				args = args.slice(1).join('+');
				var results;
				wiki().search(args, 5).then(data => {
					results=data.results;
					let output = "";
					results.forEach(function (elements, index) {output += `\`${index+1}:\` ${elements}\n`})
					Rich.setDescription(output);
					mCh.send({embed:Rich});
				});
				let collector = mCh.createMessageCollector(
					message => (message.author==msg.author&&(parseInt(message.content)>0&&parseInt(message.content)<6))
					,{ max:1, time:10000 }
				);
				collector.on('end', collected => {
					args = results[parseInt(collected.array()[0].content)-1]
					wiki().page(args).then(page => Promise.all([
						page.content(),
						page.mainImage(),
						page.raw
					]),
					error => {
						Rich.setTitle("Error");
						Rich.setDescription("An error has occured...\n\n"+error);
						mCh.send({embed:Rich});
						return;
					})
					.then(meta => {
						Rich.setTitle(meta[2].title);
						Rich.setDescription(meta[0].substring(0,250)+" ...");
						Rich.setThumbnail(meta[1]);
						Rich.setURL(meta[2].fullurl);
						mCh.send({embed:Rich});
					});
				});
			}
			else{
				args = args.join(' ');
				wiki().page(args).then(page => Promise.all([
					page.content(),
					page.mainImage(),
					page.raw
				]),
				error => {
					Rich.setTitle("Error");
					Rich.setDescription("An error has occured...\n\n"+error);
					mCh.send({embed:Rich});
					return;
				})
				.then(meta => {
					Rich.setTitle(meta[2].title);
					Rich.setDescription(meta[0].substring(0,250)+" ...");
					Rich.setThumbnail(meta[1]);
					Rich.setURL(meta[2].fullurl);
					mCh.send({embed:Rich});
				});
			}
			return;
		}

//mal

// if (args[0] == "search"){
// 				args = args.slice(1).join('+');
// 				var results;
// 				wiki().search(args, 5).then(data => {
// 					results=data.results;
// 					let output = "";
// 					results.forEach(function (elements, index) {output += `\`${index+1}:\` ${elements}\n`})
// 				});
			

		if (args[0] == "anime"){
			args = args.slice(1).join(' ');
			Rich.setAuthor("MyAnimeList","https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png","https://myanimelist.net/");
			Rich.color = 3035554;
			let results, entry;
			try{
				mal.searchAnimes(args).then(data => {
					let output = "";
					let entry;
					results = data;
					if (data[0]!=null)
						data.forEach(function (elements, index) {
							output += `\`${index+1}:\` ${elements.title}\n`
						})
					else
						output = "An error has occured. No results were returned. Please remove all symbols, check your spelling, and try again later.";
					Rich.setDescription(output);
					mCh.send({embed:Rich});
				})

				let collector = mCh.createMessageCollector(
					message => (message.author==msg.author&&parseInt(message.content)>0&&parseInt(message.content)<=results.length)
					,{ max:1, time:10000 }
				);
				collector.on('end', collected => {
					entry = results[parseInt(collected.array()[0].content)-1];
					try {
						Rich.setTitle(entry.title);
						if (entry.synopsis.length>0)
							Rich.setDescription(entry.synopsis.substring(0,250)+" ...");
						else
							Rich.setDescription("No Synopsis.");
						if (entry.english.length>0)
							Rich.addField("English Title",entry.english);
						if (entry.synonyms.length>0)
							console.log(entry.synonyms);
							// Rich.addField("Also known as:",entry.synonyms);
						if (entry.score.length>0)
							Rich.addField("Score:",entry.score );
						Rich.setThumbnail(entry.image);
						Rich.setURL("https://myanimelist.net/anime/"+entry.id);
						mCh.send({embed:Rich});
					}
					catch (err){
						console.log(err)
					}
				});
			}
			catch(err){
				console.log(err)
			}
			return;
		}

		if (args[0] == "manga"){
			args = args.slice(1).join(' ');
			Rich.setAuthor("MyAnimeList","https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png","https://myanimelist.net/");
			Rich.color = 3035554;
			let results, entry;

			try{
				mal.searchMangas(args).then(data => {
					let output = "";
					let entry;
					results = data;
					if (data[0]!=null)
						data.forEach(function (elements, index) {
							output += `\`${index+1}:\` ${elements.title}\n`
						})
					else
						output = "An error has occured. No results were returned. Please remove all symbols, check your spelling, and try again later.";
					Rich.setDescription(output);
					mCh.send({embed:Rich});
				})
				let collector = mCh.createMessageCollector(
					message => (message.author==msg.author&&parseInt(message.content)>0&&parseInt(message.content)<=results.length)
					,{ max:1, time:10000 }
				);
				collector.on('end', collected => {
					entry = results[parseInt(collected.array()[0].content)-1];
					try {
						Rich.setTitle(entry.title);
						if (entry.synopsis.length>0)
							Rich.setDescription(entry.synopsis.substring(0,250)+" ...");
						else
							Rich.setDescription("No Synopsis.");
						if (entry.english.length>0)
							Rich.addField("English Title",entry.english);
						if (entry.english.length>0)
							Rich.addField("Also known as:",entry.synonyms);
						if (entry.score.length>0)
							Rich.addField("Score:",entry.score );
						Rich.setThumbnail(entry.image);
						Rich.setURL("https://myanimelist.net/manga/"+entry.id);
						mCh.send({embed:Rich});
					}
					catch (err){
						console.log(err)
					}
				});
			}
			catch(err){
				console.log(err)
			}
			return;
		}


//Dice 3 .0

		if (args[0] == "test"){
			args = args.slice(1).join(" ");
			if (args.includes('#')){
				let comment = args.slice(args.indexOf('#')+1);
				args = args.slice(0, args.indexOf('#'));
				console.log(comment);
			}
			console.log(args);
		return;
		}


		if (args[0] == "r"||args[0] == "dice"||args[0] == "roll"){
			args = args.slice(1).join(" ");
			let comment = "";
			if (args.includes('#'))
				comment =  args.split('#')[1];
			args = args.split('#')[0].replace(/\s+/g, '').toLowerCase();

			let rDice = args.split("+");
			let sum = 0;
			let output = "";
			for (var i = 0;i<rDice.length;i++){
				if (rDice[i].includes('d')) {
					rDice[i]=rDice[i].split('d');
				}
				output += "(";
				if (!Array.isArray(rDice[i])){
					output += rDice[i];
					rDice[i][0] = -1;
				}
				if (isNaN(parseInt(rDice[i][0],10))){
					rDice[i][0] = 1;
				}
				console.log(output);
				for (var j = rDice[i][0];j>0;j--){
					let num = random(1,rDice[i][1]);
					if (rDice[i][0]>0)
						output += num;
					sum += num;
					if (j>1)
						output += "+";
				}
				console.log(output);
				output += ')';
				if (i<rDice.length-1)
					output += "+";

			}
			output += ' = ' + eval(output);
			mCh.send(msg.author + " `"+args+"`"+` = ${output} ${comment}`);
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
			Rich.addField("Result" , result);
			mCh.send({embed:Rich});
			return;
		}

//Adjective Generator Command

		if (args[0] == "adj"||args[0] == "adjective"){
			args = args.slice(1);
			let dic =adjs["adjectives"];
			var num = args[0]||1;
			var list = "\n\t";
				for (i = 0; i<num;i++){
					let rand = random(0,dic.length);
			        list+=dic[rand]+"\n\t";
				}
			}
			if (num>0&&num<=100){
				if (num == 1){
					mCh.send(`\n	
			Your generated adjective is` + "**" +list + "**");
					return;
				}
				else if (num>1){
					mCh.send(`\n
			Your generated adjectives are` + "**" +list + "**");
					return;
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
		    
			Rich.addField("Add me to your server!", `[Click here!](https://discordapp.com/oauth2/authorize?client_id=285303791937388554&scope=bot&permissions=0)`);
			mCh.send({embed: Rich});
			return;
		}

//Cleverbot
		if (args[0]== "cbot"){
			let question = args.slice(1).toString();
			if (!question){
				mCh.send(`This is the cbot command! Use this to talk with the bot. Unfortunately we're using the free API, but if you donate your money to us at `+"`"+`${prefix}support`+"`"+`, perhaps we can upgrade to a higher plan!`);
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
			args = args.slice(1);
			if (!filter[mGu.id]) {
				filter[mGu.id]={};
			}
			if (msg.member.hasPermission("ADMINISTRATOR")&&args[0]=="add"){
				if (!filter[mGu.id][args[1]]) {
					filter[mGu.id][args[1]]=[args[1]];
					fs.writeFile('./filter.json', JSON.stringify(filter), (err) => {if(err) console.error(err)});
				}
			}
			if (args[0]=="remove") {
				delete filter[mGu.id][args[1]];
				fs.writeFile('./filter.json', JSON.stringify(filter), (err) => {if(err) console.error(err)});
				mCh.send("word "+args[1]+" has been removed.");
			}
			if (args[0]=="list") {
				let list = "Filtered words are:";
				for (var i = 0 ; i < Object.keys(filter[mGu.id]).length; i++) {
					list += "\n\t" + Object.keys(filter[mGu.id])[i];
				}
				mCh.send(list);
			}
		}	

//Custom Command maker



		if (args[0]== "custom"){
			args = args.slice(1);
			if (args[0]=="remove"||args[0] == "delete"){
				args = args.slice(1);
				console.log(commands[mGu.id]);
				delete commands[mGu.id][args[0]];
				console.log(commands[mGu.id]);
				fs.writeFile('./commands.json', JSON.stringify(commands), (err) => {if(err) console.error(err)});
				console.log(commands[mGu.id]);
				return;
			}
			else if (args.toString() == "list"){
				if (Object.is(commands[mGu.id],null)){
					mCh.send("There are no custom commands.");
				}
				else{
						// mCh.send(commands[mGu.id]);
						mCh.send(commands[mGu.id]);
					}
				return;
			}
			else{
				console.log("something is worng");
				let command = args[0];
				let result = args.slice(1).join(" ");
				console.log(result);
				if (!commands[mGu.id]){
					commands[mGu.id]={};
				}
				commands[mGu.id][command] = {result: result};
				fs.writeFile('./commands.json', JSON.stringify(commands), (err) => {if(err) console.error(err)});
				return;
			}
		}

//avatar
		if (args[0]== "avatar") {
			
			if (msg.mentions.users.first())
				Rich.setImage(msg.mentions.users.first().displayAvatarURL);
			else
				Rich.setImage(msg.author.displayAvatarURL);
			mCh.send({embed: Rich});
		}

//marry
		if (args[0]== "marry") {
			args = args.slice(1);
			if (args.length<1)
				mCh.send(msg.author.toString() + " is engaged to " + msg.author.toString() + "! :heart:");
			else
				mCh.send(msg.author.toString() + " is engaged to " + args.join(" ") + "! :heart:");
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
			
			let url = args.slice(1).join("+");
			let query = args.slice(1).join(" ");
			Rich.addField("Let Me Google That For You","["+query+"](http://lmgtfy.com/?q="+url+")");
			mCh.send({embed: Rich});
		}

//Cake

		if (args[0].toLowerCase()== "cake") {
			imageItem("Cake!","cake", mCh);
		}

//Pie

		if (args[0].toLowerCase()== "pie") {
			imageItem("Pie!","pie", mCh);
		}

//Smug

		if (args[0].toLowerCase()== "smug") { 		
			smug(mCh);
		}

//Apollo

		if (args[0].toLowerCase()== "apollo") { 		
			imageItem("Apollo!","~space_shuttle+~rocket_ship", mCh);
		}

//danooru

		if (args[0]== "danbooru"||args[0]== "db") {
			Rich.color = 11375482;
			Rich.setAuthor("danbooru","","https://danbooru.donmai.us/");
			args = args.slice(1);
			if (args.length > 3  || (args.length > 2 && !(args.includes("rating:s")||args.includes("rating:safe")))) {
				Rich.addField("Error","You can only send two tags at a time.");
				mCh.send({embed: Rich});
			}
			else {
				let path = '/posts.json?api_key=rWOnqbmk1Pwqs3AYBb1_gklj8b9uOUE5e-GeUzgARGA&limit=1&random=true&tags='+args.join("+");
				var options = {
				  hostname: 'danbooru.donmai.us',
				  path: path,
				  method: 'GET',
				};

				var req = http.request(options, (res) => {
					let rawData = '';
					res.on('data', (chunk) => {
						rawData += chunk;;
				 	});
					res.on('end', () => {
				    	const parsedData = JSON.parse(rawData);
							if (parsedData.length==0){
								Rich.addField("Error","No results found.");
							}
							else {
								if (!parsedData[0].large_file_url.startsWith("http"))
									Rich.setImage('http://danbooru.donmai.us'+ parsedData[0].large_file_url);
								else
									Rich.setImage(parsedData[0].large_file_url);
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
								Rich.addField("Score", (parsedData[0].up_score-parsedData[0].down_score));
								Rich.addField("Favorites", parsedData[0].fav_count);
								}
							}
						mCh.send({embed: Rich});
					});
				});

				req.on('error', (e) => {
				  console.error(`problem with request: ${e.message}`);
				});

				req.end();
			}
		}

//e621

		if (args[0]== "e621") {
			args = args.slice(1);
			let path = '/post/index.json?limit=1&tags=order:random+'+args.join("+");
			var options = {
				hostname: 'e621.net',
				path: path,
				headers: {
					'User-Agent':  "DiscoBot (by Kisato)",
				},
				method: 'GET',
			};

		    var req = https.request(options, (res) => {
				let rawData = '';
				res.on('data', (chunk) => {
					rawData += chunk;;
			 	});
				res.on('end', () => {
			    	const parsedData = JSON.parse(rawData);
			    	if (!parsedData[0])
						Rich.addField("Error","No results found.");
					else{
						Rich.setImage(parsedData[0].file_url);
						Rich.addField("View in browser","https://e621.net/posts/show/"+ parsedData[0].id);
					}
				mCh.send({embed: Rich});
				});
			});

			req.on('error', (e) => {
	  			console.error(`problem with request: ${e.message}`);
			});
			req.end();
		}

//botstats

		if (args[0]== "botstats") {
			mCh.send("Bot is in " + bot.guilds.array().length + " servers.");
		}

//prune

		if (args[0]== "prune") {
			mCh.send("Bot is in " + bot.guilds.array().length + " servers.");
		}

//gelbooru

		if (args[0]== "gelbooru"||args[0]== "gb") {
			args = args.slice(1);
			siteDown("gelbooru.com",true,args,mCh)			
		}

//safebooru

		if (args[0]== "safebooru"||args[0]== "sb") {
			args = args.slice(1);
			siteDown("safebooru.org",false,args,mCh)	
		}

//rule34.xxx

		if (args[0]== "rule34"||args[0]== "r34") {
			args = args.slice(1);
			siteDown("rule34.xxx",true,args,mCh)
		}

//Time Zone thing http://api.timezonedb.com/v2/get-time-zone?key=YOUR_API_KEY&format=json&by=zone&zone=

		if (args[0]== "time") {
			args = args.slice(1);
			if (args[0]== "get") {
				args = args.slice(1);
				var options = {
					hostname: 'api.timezonedb.com',
					path: '/v2/get-time-zone?key=9VBESJ098TJF&format=json&by=zone&zone='+args[0],
					headers: {
						'User-Agent': "DiscoBot (by Kisato)",
					},
					method: 'GET',
				};

			    var req = https.request(options, (res) => {
					let rawData = '';
					res.on('data', (chunk) => {
						rawData += chunk;;
				 	});
					res.on('end', () => {
						timeData = JSON.parse(rawData);
						if (timeData.status == 'FAILED')
							mCh.send(timeData.message);
						if (timeData.status != 'FAILED')
							mCh.send(timeData.formatted);
					});
				});

				req.on('error', (e) => {
				  console.error(`problem with request: ${e.message}`);
				});

				req.end();

			}
			if (args[0]== "convert") {
				args = args.slice(1);
				var options = {
					hostname: 'api.timezonedb.com',
					path: '/v2/convert-time-zone?key=9VBESJ098TJF&format=json&from='+args[0]+'&to='+args[1]+'&time='+Math.floor(Date.now() / 1000),
					headers: {
						'User-Agent':  "DiscoBot (by Kisato)",
					},
					method: 'GET',
				};

			    var req = https.request(options, (res) => {
					let rawData = '';
					res.on('data', (chunk) => {
						rawData += chunk;;
				 	});
					res.on('end', () => {
						timeData = JSON.parse(rawData);
						if (timeData.status == 'FAILED')
							mCh.send(timeData.message);
						if (timeData.status != 'FAILED')
							mCh.send(timeData.offset/(60*60)+ " hours.");
					});
				});

				req.on('error', (e) => {
				  console.error(`problem with request: ${e.message}`);
				});

				req.end();
			}
			if (args[0] == "list") {
				Rich.addField('For a list of all the timezones you can check, click here!','https://timezonedb.com/time-zones');
				mCh.send({embed: Rich});
			}
		}



//bloodsuck
		if (args[0]== "bloodsuck") {
			args = args.slice(1);
			siteDown("safebooru.org",false,["vampire", "biting", "blood", "rating:safe"],mCh)
		}	

//bloodsuck

		if (args[0]== "hug") {
			args = args.slice(1);
			siteDown("safebooru.org",false,["hug","-comic","-hug_from_behind", "rating:safe"],mCh)
		}	

//is nsfw

		if (args[0]== "isnsfw") {
			
			console.log(mCh.nsfw);
			if (mCh.nsfw==true)
				Rich.addField("NSFW Checker!","This channel is NSFW!");
			else
				Rich.addField("NSFW Checker!","This channel is **not** NSFW!");
			mCh.send({embed: Rich});
		}

//Help Command
		if (args[0]== "help") {
			/*bot.users.get(msg.author.id).send(`*/
			
			Rich.addField(`Ping`,`Pings the server`);
			Rich.addField(`Dice`,`\`${prefix}dice [Insert Number]d[Insert Number]\`\nUse the following syntax \`3d5\`. You can add additional dice rolls with \`+\``);
			Rich.addField(`Flip`,`Flips a coin.`);
			// Rich.addField(`Character`,`~~See \`${prefix}char help\` for more details.~~\nCurrently out of commision.`);
			Rich.addField(`Magic8`,`\`${prefix}magic8 [question]\` \nAsk the mystical magic 8 ball a question.`);
			Rich.addField(`Adjective`,`\`${prefix}adj [amount]\` \nGenerates a certain number of defined adjectives or a default one.`);
			Rich.addField(`Invite`,`Posts the link to add the bot to your own server.\n	`);
			Rich.addField(`Avatar`,`\`${prefix}avatar\`\nSends you your avatar or the avatar of another user by mentioning them.`);
			Rich.addField(`Image Galleries`,`\`${prefix}[Database of Choice]\`\n`+
				`\`db, r34, sb, gb, e621\`\n`+
				`Follow with the tags that you want to search up. DB has a limit of two tags.`);
			Rich.addField(`Item Search`,`\`${prefix}[item]\`\n`);
			Rich.addField(`Marry`,`\`${prefix}marry\`\nMarry someone. If a valid target isn't specified, it defaults to yourself.`);
			bot.users.get(msg.author.id).send({embed: Rich});
			return;
		}




//check if custome command
		if  (mGu)
			if (commands[mGu.id]!=null) {
				if (commands[mGu.id][args[0]]!=null) {
					mCh.send(commands[mGu.id][args[0]].result)
			}
		}

	}

//Check if guild

	if (mGu){
		let guildEmojis = mGu.emojis;

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