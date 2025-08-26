const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { setRewardChannel } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-xp-reward")
    .setDescription("Choisir le salon où envoyer les messages de level-up")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addStringOption(o => o.setName("id").setDescription("ID du salon texte").setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Permission insuffisante (Manage Server).", ephemeral: true });
    }

    const channelId = interaction.options.getString("id");
    const ch = interaction.guild.channels.cache.get(channelId);

    if (!ch || !(ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildAnnouncement)) {
      return interaction.reply({ content: "⚠️ L’ID fourni ne correspond pas à un **salon texte** de ce serveur.", ephemeral: true });
    }

    setRewardChannel(interaction.guild.id, channelId);

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle("🎉 Salon de récompenses défini")
      .setDescription(`Les **embeds de level-up** seront envoyés dans <#${channelId}>.`)
      .setFooter({ text: `Salon: ${ch.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
