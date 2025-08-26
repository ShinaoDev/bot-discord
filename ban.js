const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banni un membre du serveur.')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Le membre à bannir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const member = interaction.options.getUser('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    const guildMember = interaction.guild.members.cache.get(member.id);

    if (!guildMember) {
      return interaction.reply({ content: "❌ Membre introuvable sur ce serveur.", ephemeral: true });
    }

    if (!guildMember.bannable) {
      return interaction.reply({ content: "❌ Je ne peux pas bannir ce membre.", ephemeral: true });
    }

    try {
      // Envoi MP
      await member.send(`🔨Tu as été banni du serveur **${interaction.guild.name}** 📝pour la raison : ${raison}`).catch(() => {});

      // Ban
      await guildMember.ban({ reason: raison });

      console.log(`[BAN] ${member.tag} a été banni par ${interaction.user.tag} | Raison: ${raison}`);

      await interaction.reply(`🔨 ${member.tag} a été banni. 📝Raison: ${raison}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "❌ Une erreur est survenue lors du ban.", ephemeral: true });
    }
  },
};
