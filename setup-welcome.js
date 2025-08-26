const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Configure le salon d\'accueil des nouveaux membres')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Le salon où envoyer les messages de bienvenue')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased()) {
      return interaction.reply({ content: '❌ Veuillez choisir un salon textuel.', ephemeral: true });
    }

    const filePath = path.join(__dirname, '../data/welcome.json');
    let welcomeData = {};

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content.length > 0) {
        try {
          welcomeData = JSON.parse(content);
        } catch (error) {
          console.error('Erreur JSON dans welcome.json:', error);
          welcomeData = {};
        }
      }
    }

    welcomeData[interaction.guild.id] = channel.id;

    fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2));

    await interaction.reply({ content: `✅ Le salon de bienvenue a été configuré sur ${channel}`, ephemeral: true });
  }
};
