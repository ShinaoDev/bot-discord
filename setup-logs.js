// commands/setup-logs.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-logs')
    .setDescription('Définir le salon pour recevoir les logs du serveur.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Salon pour les logs')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!channel.isTextBased()) {
      return interaction.reply({ content: 'Veuillez choisir un salon texte valide.', ephemeral: true });
    }

    const filePath = path.join(__dirname, '../data/logs.json');
    let logsData = {};
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        logsData = content.length ? JSON.parse(content) : {};
      } catch (err) {
        console.error(err);
      }
    }

    logsData[interaction.guild.id] = channel.id;

    fs.writeFileSync(filePath, JSON.stringify(logsData, null, 2));

    await interaction.reply({ content: `Salon des logs défini sur ${channel}`, ephemeral: true });
  }
};
