const fs = require('fs');
const path = require('path');
const xpPath = path.join(__dirname, '../data/xp.json');
const afkPath = path.join(__dirname, '../data/afkVocals.json');

let xpData = {};
let afkVocals = {};

if (fs.existsSync(xpPath)) {
  xpData = JSON.parse(fs.readFileSync(xpPath, 'utf-8'));
}
if (fs.existsSync(afkPath)) {
  afkVocals = JSON.parse(fs.readFileSync(afkPath, 'utf-8'));
}

module.exports = (client) => {
  setInterval(() => {
    client.guilds.cache.forEach(guild => {
      guild.members.cache.forEach(member => {
        const voice = member.voice;
        if (!voice?.channel || member.user.bot) return;

        // Vérifie si le salon est marqué comme AFK
        const afkChannels = afkVocals[guild.id] || [];
        if (afkChannels.includes(voice.channel.id)) return;

        const id = member.id;
        if (!xpData[guild.id]) xpData[guild.id] = {};
        if (!xpData[guild.id][id]) xpData[guild.id][id] = { xp: 0, level: 0 };

        xpData[guild.id][id].xp += 30;

        const currentLevel = Math.floor(0.1 * Math.sqrt(xpData[guild.id][id].xp));
        if (currentLevel > xpData[guild.id][id].level) {
          xpData[guild.id][id].level = currentLevel;
          const levelUpMessage = `🎉 ${member} est passé niveau ${currentLevel} en vocal !`;
          const channel = voice.channel;
          if (channel) channel.send(levelUpMessage).catch(() => {});
        }
      });
    });

    fs.writeFileSync(xpPath, JSON.stringify(xpData, null, 2));
  }, 60_000); // toutes les 60 sec
};
