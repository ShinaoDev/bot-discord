const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { toggleEnabled, isEnabled } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-xp")
    .setDescription("Activer/Désactiver le système d’XP sur ce serveur")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Permission insuffisante (Manage Server).", ephemeral: true });
    }

    const enabled = toggleEnabled(interaction.guild.id);

    const embed = new EmbedBuilder()
      .setColor(enabled ? 0x57F287 : 0xED4245)
      .setTitle("⚙️ Système d’XP")
      .setDescription(enabled ? "✅ L’XP est **activé** sur ce serveur." : "❌ L’XP est **désactivé** sur ce serveur.")
      .setFooter({ text: `Serveur: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
