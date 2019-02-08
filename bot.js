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






const discord = new require("discord.js");
const client = new discord.Client();
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
}
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
