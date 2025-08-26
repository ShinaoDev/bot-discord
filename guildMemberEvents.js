const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  client.on('guildMemberAdd', async member => {
    try {
      const filePath = path.join(__dirname, '../data/welcome.json');
      if (!fs.existsSync(filePath)) return;

      const welcomeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const channelId = welcomeData[member.guild.id];
      if (!channelId) return;

      const channel = member.guild.channels.cache.get(channelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`🎉 Bienvenue sur ${member.guild.name} !`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Utilisateur', value: `${member.user.tag}`, inline: true },
          { name: 'ID', value: `${member.id}`, inline: true },
          { name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true },
          { name: 'Rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true }
        )
        .setFooter({ text: `Bienvenue !`, iconURL: member.guild.iconURL() })
        .setTimestamp();

      channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur welcome:', error);
    }
  });

  client.on('guildMemberRemove', async member => {
    try {
      const filePath = path.join(__dirname, '../data/goodbye.json');
      if (!fs.existsSync(filePath)) return;

      const goodbyeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const channelId = goodbyeData[member.guild.id];
      if (!channelId) return;

      const channel = member.guild.channels.cache.get(channelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`😢 ${member.user.tag} a quitté ${member.guild.name}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Utilisateur', value: `${member.user.tag}`, inline: true },
          { name: 'ID', value: `${member.id}`, inline: true },
          { name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true },
          { name: 'A rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true }
        )
        .setFooter({ text: 'On espère te revoir bientôt !', iconURL: member.guild.iconURL() })
        .setTimestamp();

      channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur goodbye:', error);
    }
  });
};
