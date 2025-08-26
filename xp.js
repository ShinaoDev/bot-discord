const { Events, EmbedBuilder } = require("discord.js");
const xpUtils = require("../utils/xp");

module.exports = (client) => {

  const speakingUsers = new Map(); // Pour XP vocal par minute

  // ---- XP par message ----
  client.on(Events.MessageCreate, async (message) => {
    if (!message.guild || message.author.bot) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    if (!xpUtils.isEnabled(guildId)) return;

    // Ajouter XP
    const newXP = xpUtils.addXP(guildId, userId, 10);
    const newLevel = xpUtils.getLevel(newXP);
    const oldLevel = xpUtils.getLevel(newXP - 10);

    // Si level up
    if (newLevel > oldLevel) {
      const guildData = xpUtils.read();
      const channelId = guildData[guildId]?.rewardChannel;
      const channel = message.guild.channels.cache.get(channelId);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor(0x9B59B6)
          .setTitle("🎉 Level Up !")
          .setDescription(`${message.author} est maintenant niveau **${newLevel}** !`)
          .setThumbnail(message.author.displayAvatarURL())
          .setTimestamp();
        channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  });

  // ---- XP vocal ----
  client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const guildId = newState.guild.id;
    if (!xpUtils.isEnabled(guildId)) return;

    // Ignore les bots
    if (newState.member.user.bot) return;

    // Déconnecté ou AFK
    if ((oldState.channelId && !newState.channelId) || newState.channel?.name?.toLowerCase().includes("afk")) {
      speakingUsers.delete(newState.id);
      return;
    }

    // Rejoindre un vocal actif
    if (newState.channelId && !speakingUsers.has(newState.id)) {
      speakingUsers.set(newState.id, Date.now());
    }
  });

  // ---- Intervalle pour XP vocal ----
  setInterval(() => {
    speakingUsers.forEach((start, userId) => {
      const member = client.users.cache.get(userId);
      if (!member) return;

      const guilds = client.guilds.cache.filter(g => g.members.cache.has(userId));
      guilds.forEach(guild => {
        const guildId = guild.id;
        const memberGuild = guild.members.cache.get(userId);

        // Ignorer les salons AFK
        const guildData = xpUtils.read();
        const afkChannels = guildData[guildId]?.afkChannels || [];
        if (memberGuild.voice.channelId && afkChannels.includes(memberGuild.voice.channelId)) return;

        // Ajouter XP vocal
        const newXP = xpUtils.addXP(guildId, userId, 30);
        const newLevel = xpUtils.getLevel(newXP);
        const oldLevel = xpUtils.getLevel(newXP - 30);

        // Level-up embed
        if (newLevel > oldLevel) {
          const channelId = guildData[guildId]?.rewardChannel;
          const channel = guild.channels.cache.get(channelId);
          if (channel) {
            const embed = new EmbedBuilder()
              .setColor(0x9B59B6)
              .setTitle("🎉 Level Up !")
              .setDescription(`${memberGuild} est maintenant niveau **${newLevel}** !`)
              .setThumbnail(memberGuild.user.displayAvatarURL())
              .setTimestamp();
            channel.send({ embeds: [embed] }).catch(() => {});
          }
        }
      });
    });
  }, 60000); // toutes les minutes

};
