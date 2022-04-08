/**
 * Docs
 * npm install discord.js@~12.5.3 erela.js @discordjs/voice 
 * add token and provide prefix
 * if you have own lavalink you can add your own and set secure to **FALSE**
 * to run bot use **npm run start**
 */

const { Client, MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const client = new Client();

const prefix = '!';
const token = '';
const radioStation = {
	ecq_18k: 'http://112.121.151.133:8147/live',
};

const manager = new Manager({
	nodes: [
		{
			host: "lavalink-1.nonnyha5.repl.co", 
			port: 443, 
			password: "reirin",
			secure: true,
			retryAmount: Infinity,
  			retryDelay: 3000,
		},
	],
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});
//========================= Node event =========================
manager.on("nodeConnect", node =>{
	console.log(`Node ${node.options.identifier} Connected!`)
});
manager.on("nodeError", (node, error) =>{
	console.log(`Node ${node.options.identifier} had an error: ${error.message}`)
});
manager.on('nodeDisconnect', (node) =>{
	console.log(`Node ${node.options.identifier} Disconnected!`)
});

//========================= Erela.js Event =========================
manager.on("trackStart", (player, track) => {
	const channel = client.channels.cache.get(player.textChannel)
	channel.send(`**กำลังเล่นเพลง:**\n\`\`\`${track.title}\`\`\``);
});
manager.on("queueEnd", (player) => {
	const channel = client.channels.cache.get(player.textChannel)
	channel.send("คิวหมดเเล้วน่ะ");
    player.destroy();
});
manager.on('playerDestroy', (player) => {
	const channel = client.channels.cache.get(player.textChannel)
});

//========================= Client Event =========================
client.on("ready", () =>{
	console.log(`${client.user.tag} Is ready to Play Music`);
	manager.init(client.user.id);
});
client.on("ready", () =>{
	// set activity
	let i = 0;
	let activity = ['Music', 'เพลง', '歌', '歌曲', 'песня', 'गाना', '노래'];
	setInterval(async() => {
		if(i === activity.length) i = 0;
		await client.user.setActivity(`${activity[i]}`, {
			type: "LISTENING", 
		});
		i++
	},5 * 1000);
});

client.on("raw", (d) =>{
	manager.updateVoiceState(d)
});

client.on("message", async (message) =>{
	if(message.author.bot) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

	
	if(cmd === 'play' || cmd === 'p'){
		play(client, message, args);
	}
	else if(cmd === 'pause'){
		pause(client, message, args);
	}
	else if(cmd === 'resume'){
		resume(client, message, args);
	}
	else if(cmd === 'skip' || cmd === 'sk'){
		skip(client, message, args);
	}
	else if(cmd === 'stop' || cmd === 'dc' || cmd === 'disconnect'){
		stop(client, message, args);
	}
	else if(cmd === 'nowplaying' || cmd === 'np'){
		nowplaying(client, message, args);
	}
	else if(cmd === 'queue' || cmd === 'q'){
		queue(client, message, args);
	}
	else if(cmd === 'loop' || cmd === 'repeat'){
		loop(client, message, args);
	}
	else if(cmd === 'volume' || cmd === 'vol'){
		volume(client, message, args);
	}
	else if(cmd === 'shuffle'){
		shuffle(client, message, args);
	}
	else if(cmd === 'j' || cmd === 'join' || cmd === 'connect'){
		connect(client, message, args);
	}
	else if(cmd === 'radio'){
		radio(client, message, args);
	}
	else if(cmd === 'clearqueue'){
		clearQueue(client, message, args);
	}
	else if(cmd === 'help' || cmd === 'h'){
		help(client, message, args);
	}
	else {
		if(message.content.startsWith(prefix)){
			return message.channel.send('ฮืมม.. รู้สึกว่าคำสั่งนี้ไม่สามารถใช้ได้หรือไม่มีคำสั่งนี้น่ะ');
		}
	}
});

let help = async(client, message, args) =>{
	let help_embed = new MessageEmbed()
		.setColor('RANDOM')
		.setAuthor('📗 หน้าต่างช่วยเหลือ', message.guild.iconURL())
		.addFields(
			[
				{
					name: `:notes: | \` ${prefix}help \``,
					value: `คำสั่งช่วยเหลือ`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}play \``,
					value: `เล่นเพลง`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}pause \``,
					value: `หยุดชั่วคราว`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}resume \``,
					value: `เล่นเพลงต่อ`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}skip \``,
					value: `ข้ามเพลง`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}stop \``,
					value: `หยุดเพลง`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}nowplaying \``,
					value: `เพลงที่กำลังเล่น`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}queue \``,
					value: `รายการคิว`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}loop \``,
					value: `วนซ้ำ`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}volume \``,
					value: `ความดังเสียง`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}shuffle \``,
					value: `สุ่มเรียงคิวใหม่`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}connect \``,
					value: `เข้าช่องเสียง`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}radio \``,
					value: `ฟังเพลงจากสถานีวิทยุ`, 
					inline: true,
				},
				{
					name: `:notes: | \` ${prefix}clearqueue \``,
					value: `ล้างคิวเพลง`, 
					inline: true,
				},
			]
		)
		.setFooter(`${client.user.tag}`, client.user.displayAvatarURL())
		.setTimestamp();

	message.channel.send(help_embed);
}
let play = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!args[0]) return message.channel.send('โปรดระบุเพลงที่ต้องการด้วยน่ะ');
	else {
		let queary = args.join(' ');
		let player = manager.players.get(message.guild.id);
		if(!player){
			player = manager.create({
				guild: message.guild.id,
				voiceChannel: message.member.voice.channel.id,
				textChannel: message.channel.id,
				selfDeafen: false,
				selfMute: false,
				volume: 80,
			});
		}
		if(player.state !== 'CONNECTED') player.connect();
		let res = await manager.search(queary, message.author);

		switch(res.loadType){
			case "LOAD_FAILED":
			{
				if(!player.queue.current) player.destroy();
				await message.channel.send('ไม่สามารถโหลดผลการค้นหาได้');
			}
			break;
			case "NO_MATCHES":
			{
				if(!player.queue.current) player.destroy();
				await message.channel.send(`ไม่พบผลการค้นหาสำหรับ ${queary}`);
			}
			break;
			case "PLAYLIST_LOADED":
			{
				await player.queue.add(res.tracks);
				message.channel.send(`:white_check_mark: เพิ่ม Playlist: \`${res.playlist.name}\` เรียบร้อยเเล้ว`);
				if(!player.playing){
					player.play();
				}
			}
			break;
			case "SEARCH_RESULT":
			{
				await player.queue.add(res.tracks[0]);
				message.channel.send(`:white_check_mark:  เพิ่มเพลง \`${res.tracks[0].title}\` เรียบร้อยเเล้ว`);
				if(!player.playing){
					player.play();
				}
			}
			break;
			case "TRACK_LOADED":
			{
				await player.queue.add(res.tracks[0]);
				message.channel.send(`:white_check_mark: เพิ่มเพลง \`${res.tracks[0].title}\` เรียบร้อยเเล้ว`);
				if(!player.playing){
					player.play();
				}
			}
			break;
		}
	}
}
let pause = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else if(player.paused) return message.channel.send(':warning: ตอนนี้กำลังหยุดชั่วคราวอยู่น่ะ');
	else{
		player.pause(true);
		message.channel.send(`:white_check_mark: ทำการหยุดชั่วคราวเรียบร้อยเเล้ว`);
	}
}
let resume = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else if(!player.paused) return message.channel.send(':warning: ตอนนี้กำลังเล่นเพลงอยู่น่ะ');
	else{
		player.pause(false);
		message.channel.send(`:white_check_mark: ทำการเล่นเพลงต่อเรียบร้อยเเล้ว`);
	}
}
let skip = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else{
		player.stop();
		message.channel.send(`:white_check_mark: ทำการข้ามเพลงเรียบร้อยเเล้ว`);
	}
}
let stop = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else{
		player.destroy();
		message.channel.send(`:white_check_mark: ทำการปิดเพลงเรียบร้อยเเล้ว`);
	}
}
let nowplaying = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else{
		let tracks = player.queue.current;
		message.channel.send(`**กำลังเล่น** \n\n\`${tracks.title}\``);
	}
}
let queue = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else if(!player.queue.size || player.queue.size === 0 || !player.queue || player.queue.length === 0) return message.channel.send('คุณยังไม่มีคิวการเล่นน่ะ');
	else{
		let queueMsg = '**คิวเพลง**\n';
		for(let i = 0; i < player.queue.length; i++){
			queueMsg += `\`${i + 1})\` [${convertTime(player.queue[i].duration)}] - ${player.queue[i].title}`
		}
		message.channel.send(queueMsg); 
	}

	async function convertTime(duration){
		var milliseconds = parseInt((duration % 1000) / 100),
		  	seconds = parseInt((duration / 1000) % 60),
		  	minutes = parseInt((duration / (1000 * 60)) % 60),
		  	hours = parseInt((duration / (1000 * 60 * 60)) % 24);
	
		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
	
		if (duration < 3600000) {
		  return minutes + ":" + seconds;
		} else {
		  return hours + ":" + minutes + ":" + seconds;
		}
	}
}
let loop = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else{
		if(!player.trackRepeat && !player.queueRepeat){
			player.setQueueRepeat(true);
			message.channel.send(`:white_check_mark: ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` เรียบร้อยเเล้ว`);
		}
		else if(player.queueRepeat && !player.trackRepeat){
			player.setTrackRepeat(true); 
			player.setQueueRepeat(false);
			message.channel.send(`:white_check_mark: ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` เรียบร้อยเเล้ว`);
		}
		else if(!player.queueRepeat && player.trackRepeat){
			player.setTrackRepeat(false);
			message.channel.send(`:white_check_mark: ทำการปิดการวนซ้ำเรียบร้อยเเล้ว`);
		}
	}
}
let volume = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else{
		let new_volume = args[0];
		if(new_volume > 100) return message.channel.send(`:warning: ไม่สามารถเพิ่มเสียงมากกว่า \`100\` ได้น่ะ`);
		else if(new_volume < 0) return message.channel.send(':warning: ไม่สามารถลดเสียงน้อยกว่า \`0\` ได้น่ะ');
		else{
			player.setVolume(new_volume);
			message.channel.send(`:white_check_mark: ทำการตั้งค่าความดังเสียงเป็น \`${new_volume}\` เรียบร้อยเเล้ว`);
		}
	}
}
let shuffle = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else if(!player.queue.length || player.queue.length === 0 || !player.queue) return message.channel.send('คุณยังไม่มีคิวการเล่นมากพอน่ะ');
	else{
		player.queue.shuffle();
		message.channel.send(`:white_check_mark: ทำการสุ่มเรียงคิวใหม่เรียบร้อยเเล้ว`);
	}
}
let connect = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(player || player.state == "CONNECTED") return message.channel.send('ตอนนี้กำลังเชื่อมต่ออยู่น่ะ');
	else{
		player = manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
			selfDeafen: false,
			selfMute: false,
			volume: 80,
		});
		player.connect();
		message.channel.send(`:white_check_mark: เข้าช่อง ${channel.name} เเล้ว`);
	}
}
let radio = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else{
		if(!player){
			player = manager.create({
				guild: message.guild.id,
				voiceChannel: message.member.voice.channel.id,
				textChannel: message.channel.id,
				selfDeafen: false,
				selfMute: false,
				volume: 80,
			});
		}
		if(player.state !== 'CONNECTED') player.connect();
		playRadio(radioStation.ecq_18k);
	}
	async function playRadio(url){
		let res = await manager.search(url, message.author);
		switch(res.loadType){
			case "LOAD_FAILED":
			{
				if(!player.queue.current) player.destroy();
				await message.channel.send('เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลังน่ะ');
			}
			break;
			case "SEARCH_RESULT":
			{
				await player.queue.add(res.tracks[0]);
				message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`:white_check_mark:  กำลังเล่นเพลง [จากสถานีวิทยุ 18k-Radio](https://ecq-studio.com/18K/X/)`));
				if(!player.playing){
					player.play();
				}
			}
			break;
			case "TRACK_LOADED":
			{
				await player.queue.add(res.tracks[0]);
				message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`:white_check_mark: กำลังเล่นเพลง [จากสถานีวิทยุ 18k-Radio](https://ecq-studio.com/18K/X/)`));
				if(!player.playing){
					player.play();
				}
			}
			break;
		}
	}
}
let clearQueue = async(client, message, args) =>{
	let channel = message.member.voice.channel;
	let player = manager.players.get(message.guild.id);
	if(!channel) return message.channel.send('โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	else if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)) return message.channel.send('ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	else if(!player || !player.queue.current) return message.channel.send('ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
	else if(!player.queue.length || player.queue.length === 0 || !player.queue) return message.channel.send('คุณยังไม่มีคิวการเล่นมากพอน่ะ');
	else{
		player.queue.clear();
		message.channel.send(`:white_check_mark: ทำการล้างคิวเรียบร้อยเเล้ว`);
	}
}

//========================= player Event =========================
client.on('voiceStateUpdate', async(oldState, newState) =>{
	let player = await manager.players.get(newState.guild.id);
	if(player){
		if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
		if (newState.id !== client.user.id) return;
		
		player.destroy();
		player.disconnect();
	}  
});
client.on('voiceStateUpdate', async(oldState, newState) =>{
	let player = await manager.players.get(newState.guild.id);
    if(player){
        const voiceChannel = newState.guild.channels.cache.get(player.voiceChannel);
        if(player.playing && voiceChannel.members.size < 2){
            player.destroy();
            player.disconnect();
        }
    } 
});

//========================= Error Handler(Anti Error) ========================= 

process.on('unhandledRejection', async(reason, p) =>{
    console.log("[Anti-crash] Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on('uncaughtException', async(err, origin) =>{
    console.log("[Anti-crash] Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', async(err, origin) =>{
    console.log("[Anti-crash] Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);   
});

//========================= Login To Bot ========================= 
client.login(token);

