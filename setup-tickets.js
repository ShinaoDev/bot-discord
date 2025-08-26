const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Créer le panneau des tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Create a Ticket')
      .setDescription(
        `✨🌞 **Bienvenue dans le support !** 🌞✨\n\n` +
        `Pour obtenir de l’aide, cliquez simplement sur le bouton ci-dessous et choisissez l’une des options suivantes :\n\n` +
        `• 🛠️ | **Aide**\nPour toute demande d’assistance ou question générale.\n\n` +
        `• 🧑‍💼 | **Recrutement**\nPour rejoindre l’équipe.\n\n` +
        `• ⚠️ | **Plainte**\nPour signaler un problème ou déposer une plainte à l’égard d’une personne.\n\n` +
        `Nous sommes là pour vous aider, quelle que soit votre demande ! 🙂`
      )
      .setColor('Blurple');

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_aide')
        .setLabel('🛠️ Aide')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ticket_recrutement')
        .setLabel('🧑‍💼 Recrutement')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('ticket_plainte')
        .setLabel('⚠️ Plainte')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ content: '✅ Panneau des tickets envoyé !', ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [buttons] });
  }
};
