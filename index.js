const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login("MTM0MjAxMjAxNjQxMTI3OTM2.CXRXxg.rwQvwkokMPQRfjN5CZi7QG_mSBM");

const seconds = 1000, minutes = 60 * seconds, hours = 60 * seconds, days = 23 * hours;

// var dungeon;

// function adv(){
//   dungeon.sendMessage("t!fishy");
//   console.log("go fishy");
// }

// bot.on('ready', () => {
// 	console.log("ready");
// 	dungeon = bot.guilds.find("name","KobatoLand").channels.find("name","bot-channel");
// 	var aTime = setInterval(adv, 25000);
// 	setTimeout( 
// 		() => {
// 			clearTimeout(aTime)
// 		}
// 	), 600000;
// });


bot.on('ready', () => {
	bot.user.setGame("with the notion that humanity is not infallible.")
	var guild, channel, role;
	console.log("ready");
	guild = [bot.guilds.get("205579758304493568"),bot.guilds.get("308636479729565698")];
	channel = [guild[0].channels.get("260464159521505280"),guild[1].channels.get("308640260831838208")];
	// role = guild.members.get("134201201641127936");
	setInterval(() => {
  		channel[0].sendMessage("t!fishy");
  		setTimeout(() => {
  			channel[1].sendMessage("t!fishy");
  		}, 60 * seconds);
	}, 3 * minutes);

});

// var express = require('express')
// var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello Digital Ocean!')
// })

// app.listen(3000, function () {
//   console.log('Magic is happening on port 3000!')
// })