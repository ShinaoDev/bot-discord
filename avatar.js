const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar de l'utilisateur.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux voir l'avatar")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const avatarEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [avatarEmbed] });
  }
};
