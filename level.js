const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserXP, getLevel } = require("../utils/xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Voir ton niveau ou celui d’un autre membre")
    .addUserOption(o => o.setName("membre").setDescription("Choisir un membre")),
  async execute(interaction) {
    const target = interaction.options.getUser("membre") || interaction.user;
    const guildId = interaction.guild.id;

    const xp = getUserXP(guildId, target.id);
    const level = getLevel(xp);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: `Statistiques de ${target.username}`, iconURL: target.displayAvatarURL() })
      .setDescription([
        `**Niveau :** ${level}`,
        `**XP :** ${xp}`,
      ].join("\n"))
      .setThumbnail(target.displayAvatarURL())
      .setFooter({ text: `Serveur: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
