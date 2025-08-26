const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre avec une raison.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('Le membre à avertir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('La raison de l\'avertissement')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Membre introuvable dans ce serveur.', ephemeral: true });
    }
    
    if (member.id === interaction.user.id) {
      return interaction.reply({ content: '❌ Vous ne pouvez pas vous warn vous-même.', ephemeral: true });
    }

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Impossible de warn un administrateur.', ephemeral: true });
    }

    // Envoi d'un MP au membre warn
    try {
      await user.send(`⚠️ Vous avez reçu un avertissement sur **${interaction.guild.name}**.\n📝Raison : ${reason}`);
    } catch {
      // ignore si mp fermé
    }

    // Réponse visible par tous
    await interaction.reply({
      content: `✅ Warn pour ${user}\n⚠️ Raison: ${reason}`,
      ephemeral: false
    });
  }
};
