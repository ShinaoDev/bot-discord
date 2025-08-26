const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { resetXP } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-xp")
    .setDescription("Réinitialiser l’XP d’un membre")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addUserOption(o => o.setName("membre").setDescription("Membre").setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Permission insuffisante (Manage Server).", ephemeral: true });
    }

    const member = interaction.options.getUser("membre");
    const guildId = interaction.guild.id;

    resetXP(guildId, member.id);

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle("♻️ Réinitialisation")
      .setDescription(`L’XP de **${member.username}** a été remis à **0**.`)
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `Par ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
