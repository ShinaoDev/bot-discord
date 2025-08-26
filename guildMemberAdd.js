const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const filePath = path.join(__dirname, '../data/welcome.json');
    if (!fs.existsSync(filePath)) return;

    let welcomeData = {};
    try {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content.length > 0) welcomeData = JSON.parse(content);
    } catch (error) {
      console.error('Erreur lecture welcome.json:', error);
      return;
    }

    const channelId = welcomeData[member.guild.id];
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

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

    channel.send({ embeds: [embed] }).catch(console.error);
  }
};
