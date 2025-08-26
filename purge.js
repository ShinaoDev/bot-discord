// commands/purge.js
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Supprime un certain nombre de messages dans le salon.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Nombre de messages à supprimer (max 100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: '❌ Vous n\'avez pas la permission de gérer les messages.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true); // true = ignore les messages trop vieux

      return interaction.reply({ content: `✅ ${deleted.size} message(s) supprimé(s).`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Impossible de supprimer les messages.', ephemeral: true });
    }
  }
};
