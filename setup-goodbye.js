const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-goodbye')
    .setDescription('Configure le salon d\'adieu des membres qui quittent')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Le salon où envoyer les messages d\'adieu')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased()) {
      return interaction.reply({ content: '❌ Veuillez choisir un salon textuel.', ephemeral: true });
    }

    const filePath = path.join(__dirname, '../data/goodbye.json');
    let goodbyeData = {};

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content.length > 0) {
        try {
          goodbyeData = JSON.parse(content);
        } catch (error) {
          console.error('Erreur JSON dans goodbye.json:', error);
          goodbyeData = {};
        }
      }
    }

    goodbyeData[interaction.guild.id] = channel.id;

    fs.writeFileSync(filePath, JSON.stringify(goodbyeData, null, 2));

    await interaction.reply({ content: `✅ Le salon d'adieu a été configuré sur ${channel}`, ephemeral: true });
  }
};
