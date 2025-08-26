const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Affiche les informations d'un utilisateur.")
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('L’utilisateur dont tu veux voir les infos')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const member = interaction.guild ? await interaction.guild.members.fetch(user.id) : null;

    const embed = new EmbedBuilder()
      .setTitle(`📋 Informations sur ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor('#5865F2') // Couleur Blurple de Discord
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '🔤 Tag', value: user.tag, inline: true },
        { name: '📅 Créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
      );

    if (member) {
      embed.addFields(
        { name: '📥 Arrivé sur le serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: '📡 Statut', value: member.presence?.status || 'Inconnu', inline: true },
        {
          name: '🎭 Rôles',
          value: member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .map(r => r.toString())
            .join(', ') || 'Aucun',
          inline: false
        }
      );
    }

    await interaction.reply({ embeds: [embed] });
  }
};
