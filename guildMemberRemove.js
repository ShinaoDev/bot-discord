const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const filePath = path.join(__dirname, '../data/goodbye.json');
    if (!fs.existsSync(filePath)) return;

    let goodbyeData = {};
    try {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content.length > 0) goodbyeData = JSON.parse(content);
    } catch (error) {
      console.error('Erreur lecture goodbye.json:', error);
      return;
    }

    const channelId = goodbyeData[member.guild.id];
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

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

    channel.send({ embeds: [embed] }).catch(console.error);
  }
};
