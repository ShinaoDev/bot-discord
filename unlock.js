const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Déverrouille ce salon (autorise les membres à envoyer des messages)'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return await interaction.reply({
        content: '❌ Tu n’as pas la permission de déverrouiller les salons.',
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
    });

    await interaction.reply(`🔓 Ce salon est maintenant **déverrouillé**.`);
  },
};
