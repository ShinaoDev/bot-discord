const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un membre du serveur.')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Le membre à expulser')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison de l\'expulsion')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const member = interaction.options.getUser('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    const guildMember = interaction.guild.members.cache.get(member.id);

    if (!guildMember) {
      return interaction.reply({ content: "❌ Membre introuvable sur ce serveur.", ephemeral: true });
    }

    if (!guildMember.kickable) {
      return interaction.reply({ content: "❌ Je ne peux pas expulser ce membre.", ephemeral: true });
    }

    try {
      // Envoi MP
      await member.send(`👢Tu as été expulsé du serveur **${interaction.guild.name}** 📝pour la raison : ${raison}`).catch(() => {});

      // Kick
      await guildMember.kick(raison);

      console.log(`[KICK] ${member.tag} a été expulsé par ${interaction.user.tag} | 📝Raison: ${raison}`);

      await interaction.reply(`👢 ${member.tag} a été expulsé. 📝Raison: ${raison}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "❌ Une erreur est survenue lors de l'expulsion.", ephemeral: true });
    }
  },
};
