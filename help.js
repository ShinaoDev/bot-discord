const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche toutes les commandes du bot'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Liste des commandes disponibles')
      .setColor(0x00AEFF)
      .setDescription("Voici toutes les commandes que vous pouvez utiliser :")
      .addFields(
        {
          name: '🛠️ Modération',
          value: `
          \`/ban\` - Bannir un membre
          \`/kick\` - Expulser un membre
          \`/mute\` - Mute un membre
          \`/tempmute\` - Temporairement mute un membre
          \`/unmute\` - Démute un membre
          \`/tempban\` - Bannir temporairement un membre
          \`/warn\` - Avertir un membre
          \`/clear\` - Réinitialise un salon
          \`/purge\` - Supprimer un nombre de messages
          \`/lock\` - Verrouiller un salon
          \`/unlock\` - Déverrouiller un salon
          \`/reset-xp\` - Réinitialiser l’XP d’un membre
          \`/say\` - Faire parlé le bot.
          \`/dm\` - Envoie un message privé à un utilisateur via son ID.
          \`/lock\` - verouille le salon.
          \`/unlock\` - deverouille le salon.
          \`/level\` - vérifier votre level.
          \`/reset-xp\` - Reset les niveaux d'une personne.
          `,
        },
        {
          name: '📊 Système d’XP',
          value: `
          \`/setup-xp\` - Active le système d'XP
          \`/setup-levelup\` - Définit le salon des messages de level-up
          \`/setup-xp-afk\` - Désactive l'XP dans certains vocaux
          \`/level\` - Voir votre niveau
          `,
        },
        {
          name: '🎟️ Tickets',
          value: `\`/setup-tickets\` - Met en place les tickets (plainte, recrutement, partenariats)`,
        },
        {
          name: '👋 Arrivées / Départs',
          value: `
          \`/setup-welcoms\` - Message d’arrivée personnalisé
          \`/setup-leaves\` - Message de départ personnalisé
          `,
        },
        {
          name: '📄 Logs',
          value: `\`/setup-logs\` - Active les logs de suppression, édition, ghost ping, vocaux`,
        },
        {
          name: '🔁 Autres',
          value: `
          \`/help\` - Affiche cette aide
          `,
        },
      )
      .setFooter({ text: 'Utilise les slash commands pour plus d’infos.' });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
