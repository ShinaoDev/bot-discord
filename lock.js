const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Verrouille ce salon (empêche les membres d’envoyer des messages)'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return await interaction.reply({
        content: '❌ Tu n’as pas la permission de verrouiller les salons.',
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    await interaction.reply(`🔒 Ce salon est désormais **verrouillé**.`);
  },
};
