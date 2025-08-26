const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription("Débannir un utilisateur avec son ID")
    .addStringOption(option =>
      option.setName('userid')
        .setDescription("L'ID de l'utilisateur à débannir")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('raison')
        .setDescription("Raison du débannissement")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await interaction.reply({
        content: '❌ Tu n’as pas la permission de débannir des membres.',
        ephemeral: true
      });
    }

    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('raison') || "Aucune raison spécifiée.";

    try {
      const user = await interaction.guild.bans.fetch(userId);
      if (!user) {
        return await interaction.reply({
          content: '❌ Cet utilisateur n’est pas banni.',
          ephemeral: true
        });
      }

      await interaction.guild.members.unban(userId, reason);

      await interaction.reply(`✅ <@${userId}> a été débanni avec succès.\n📝 Raison : ${reason}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Une erreur est survenue. Assure-toi que l\'ID est correct.',
        ephemeral: true
      });
    }
  }
};
