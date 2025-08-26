const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Envoie un message privé à un utilisateur via son ID')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID de l\'utilisateur')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message à envoyer')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // seulement admins

  async execute(interaction) {
    const userId = interaction.options.getString('id');
    const messageToSend = interaction.options.getString('message');

    try {
      // On récupère l'utilisateur via son ID
      const user = await interaction.client.users.fetch(userId);

      // On envoie le DM
      await user.send(messageToSend);

      // Réponse éphémère avec emoji ✅
      await interaction.reply({ content: '✅ Message envoyé en DM !', ephemeral: true });
    } catch (error) {
      // En cas d'erreur (ex: DM fermé), on répond avec emoji ❌
      await interaction.reply({ content: '❌ Impossible d\'envoyer le DM.', ephemeral: true });
    }
  }
};
