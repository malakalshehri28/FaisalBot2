const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = "#";
client.on('ready', () => {
   console.log(`----------------`);
      console.log(`Desert Bot- Script By : AJ`);
        console.log(`----------------`);
      console.log(`ON ${client.guilds.size} Servers '     Script By : AJ ' `);
    console.log(`----------------`);
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(`Free Mic.`,"http://twitch.tv//idk")
});







let data = JSON.parse(fs.readFileSync('./database.json' , 'utf8'));
 
client.on('message', message => {
    if(message.content === `${prefix}setAntifake`) {
     let args = message.content.split(" ").slice(1).join(" ")
if(!args) return message.channel.send(`Please To Set The AntiFake Write The Invite User Limt Example: ${prefix}setAntifake 7`)
let embed = new Discord.RichEmbed()
.setTitle('Done Antifake Setup Has Been Completed !')
.addField('The Limt:', `${args}`)
.addField('The Setup Started By', `${message.author}`)
.setFooter(`Requested by : ${message.author}`)
data[message.guild.id] = {
limt: args,
onoff: 'On'
}
fs.writeFile("./database.json", JSON.stringify(data), (err) => {
    if (err) console.error(err)
    .catch(err => {
      console.error(err);
    })
})
    }
 
        if(message.content.startsWith(prefix + "toggleantifake")) {
            if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
            if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
            if(!data[message.guild.id]) data[message.guild.id] = {
                onoff: 'Off',
            }
              if(data[message.guild.id].onoff === 'Off') return [message.channel.send(`**The AntiFake Is __𝐎𝐍__ !**`), data[message.guild.id].onoff = 'On']
              if(data[message.guild.id].onoff === 'On') return [message.channel.send(`**The Antifake Is __𝐎𝐅𝐅__ !**`), data[message.guild.id].onoff = 'Off']
              fs.writeFile("./database.json", JSON.stringify(data), (err) => {
                if (err) console.error(err)
                .catch(err => {
                  console.error(err);
                })
            })
        }
 
})
 
 
 
var invs2 = {}
var invites = {};
 
client.on('ready', () => {
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});
 
client.on('guildMemberAdd', member => {
    if(!data[member.guild.id]) data[member.guild.id] = {
        onoff: 'Off',
      }
      if(data[member.guild.id].onoff === 'Off') return;
 
    member.guild.fetchInvites().then(ServerInvs => {
        var ei = invites[member.guild.id];
        invites[member.guild.id] = ServerInvs;
        var invite = ServerInvs.find(i => ei.get(i.code).uses < i.uses);
        if (!invs2[invite.code]) invs2[invite.code] = {users: new Set()};
        invs2[invite.code].users.delete(member.id);
        setTimeout(function(){
            invs2[invite.code].users.remove(member.id);
        },10000);
        var x = 0;
        invs2[invite.code].users.forEach(() => {
            x++;
            if (x >= data[member.guild.id].limt) {
                invs2[invite.code].users.forEach(user => {
                    member.guild.members.get(user).ban();
                    fs.writeFile("./database.json", JSON.stringify(data), (err) => {
                        if (err) console.error(err)
                        .catch(err => {
                          console.error(err);
                        })
                    })
                });
            };
        });
    });
});







var config = {
  events: [
    {type: "CHANNEL_CREATE", logType: "CHANNEL_CREATE", limit: 1 , delay: 3000},
{type: "CHANNEL_CREATE", logType: "CHANNEL_CREATE", limit: 1 , delay: 2000},
{type: "CHANNEL_CREATE", logType: "CHANNEL_CREATE", limit: 5 , delay: 1000},
    {type: "CHANNEL_DELETE", logType: "CHANNEL_DELETE", limit: 1, delay: 3000},
{type: "CHANNEL_DELETE", logType: "CHANNEL_DELETE", limit: 1, delay: 2000},
{type: "CHANNEL_DELETE", logType: "CHANNEL_DELETE", limit: 5, delay: 1000},
    {type: "GUILD_MEMBER_REMOVE", logType: "MEMBER_KICK", limit: 1, delay: 3000},
{type: "GUILD_MEMBER_REMOVE", logType: "MEMBER_KICK", limit: 1, delay: 2000},
{type: "GUILD_MEMBER_REMOVE", logType: "MEMBER_KICK", limit: 5, delay: 1000},
    {type: "GUILD_BAN_ADD", logType: "MEMBER_BAN_ADD", limit: 1, delay: 3000},
{type: "GUILD_BAN_ADD", logType: "MEMBER_BAN_ADD", limit: 1, delay: 2000},
{type: "GUILD_BAN_ADD", logType: "MEMBER_BAN_ADD", limit: 5, delay: 1000}
  ]
client.on("raw", (packet)=> {
  let {t, d} = packet, type = t, {guild_id} = data = d || {};
  if (type === "READY") {
    client.startedTimestamp = new Date().getTime();
    client.captures = [];
  }
  let event = config.events.find(anEvent => anEvent.type === type);
  if (!event) return;
  let guild = client.guilds.get(guild_id);
  if (!guild) return;
  guild.fetchAuditLogs({limit : 1, type: event.logType})
    .then(eventAudit => {
      let eventLog = eventAudit.entries.first();
      if (!eventLog) return;
      let executor = eventLog.executor;
      guild.fetchAuditLogs({type: event.logType, user: executor})
        .then((userAudit, index) => {
          let uses = 0;
          userAudit.entries.map(entry => {
            if (entry.createdTimestamp > client.startedTimestamp && !client.captures.includes(entry.id)) uses += 1;
          });
          setTimeout(() => {
            client.captures.push(index);
          }, event.delay || 2000)
          if (uses >= event.limit) {
            client.emit("reachLimit", {
              user: userAudit.entries.first().executor,
              member: guild.members.get(executor.id),
              guild: guild,
              type: event.type,
            })
          }
        }).catch(console.error)
    }).catch(console.error)
});
client.on("reachLimit", (limit)=> {
  let log = limit.guild.channels.find( channel => channel.name === "log");
  log.send(limit.user.username+"\ntried to hack (!)");
  limit.guild.owner.send(limit.user.username+"\ntried to hack (!)")
  limit.member.roles.map(role => {
    limit.member.removeRole(role.id)
    .catch(log.send)
  });
});





client.login(process.env.BOT_TOKEN);
