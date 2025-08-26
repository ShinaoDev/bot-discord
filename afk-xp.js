const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { toggleAfkChannel } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk-xp")
    .setDescription("Activer/Désactiver le blocage d’XP pour un salon vocal (toggle)")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addStringOption(o => o.setName("id").setDescription("ID du salon vocal").setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Permission insuffisante (Manage Server).", ephemeral: true });
    }

    const channelId = interaction.options.getString("id");
    const ch = interaction.guild.channels.cache.get(channelId);

    if (!ch || !(ch.type === ChannelType.GuildVoice || ch.type === ChannelType.GuildStageVoice)) {
      return interaction.reply({ content: "⚠️ L’ID fourni ne correspond pas à un **salon vocal** de ce serveur.", ephemeral: true });
    }

    const { added } = toggleAfkChannel(interaction.guild.id, channelId);

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(added ? "🚫 XP bloqué" : "✅ XP rétabli")
      .setDescription(added
        ? `Les membres **ne gagneront plus d’XP** dans <#${channelId}>.`
        : `Les membres **peuvent à nouveau gagner de l’XP** dans <#${channelId}>.`)
      .setFooter({ text: `Salon: ${ch.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
