// commands/clear.js
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime tous les messages du salon en recréant le salon à l’identique.'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ Vous n\'avez pas la permission de gérer les salons.', ephemeral: true });
    }

    const channel = interaction.channel;
    const guild = interaction.guild;

    await interaction.reply({ content: 'Suppression en cours, merci de patienter...', ephemeral: true });

    try {
      // Cloner le salon
      const clonedChannel = await channel.clone({
        name: channel.name,
        topic: channel.topic,
        nsfw: channel.nsfw,
        parent: channel.parent,
        permissionOverwrites: channel.permissionOverwrites.cache,
        position: channel.position
      });

      // Supprimer l’ancien salon
      await channel.delete();

      // Mettre le salon cloné à la bonne position
      await clonedChannel.setPosition(clonedChannel.position);

      // Envoyer un message de confirmation dans le nouveau salon
      clonedChannel.send('Salon nettoyé avec succès !');

    } catch (error) {
      console.error(error);
      return interaction.editReply('❌ Une erreur est survenue lors de la suppression.');
    }
  }
};
