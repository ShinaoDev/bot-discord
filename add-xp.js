const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { addXP, getLevel, getUserXP } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-xp")
    .setDescription("Ajouter de l’XP à un membre")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addUserOption(o => o.setName("membre").setDescription("Membre").setRequired(true))
    .addIntegerOption(o => o.setName("amount").setDescription("Quantité d’XP").setRequired(true).setMinValue(1)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Permission insuffisante (Manage Server).", ephemeral: true });
    }

    const member = interaction.options.getUser("membre");
    const amount = interaction.options.getInteger("amount");
    const guildId = interaction.guild.id;

    const newXP = addXP(guildId, member.id, amount);
    const level = getLevel(newXP);

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("✅ XP ajouté")
      .setDescription(`**${amount}** XP ajoutés à **${member.username}**.`)
      .addFields(
        { name: "XP total", value: String(newXP), inline: true },
        { name: "Niveau", value: String(level), inline: true }
      )
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `Par ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
