const { 
  ChannelType, 
  PermissionFlagsBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder 
} = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const types = {
      ticket_aide: 'aide',
      ticket_recrutement: 'recrutement',
      ticket_plainte: 'plainte'
    };

    // Role staff à remplacer par l'ID réel de ton rôle modérateur
    const staffRoleId = '1379906385587867709';

    // Buttons pour claim et close
    const ticketButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('Claim')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    );

    if (interaction.customId.startsWith('ticket_')) {
      const type = types[interaction.customId];
      if (!type) return;

      // Formatage du pseudo pour un nom valide de salon
      const usernameFormatted = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Empêche la création de plusieurs tickets identiques par la même personne
      const existing = interaction.guild.channels.cache.find(c =>
        c.name === `ticket-${type}-${usernameFormatted}-${interaction.user.id}`
      );
      if (existing) {
        return interaction.reply({ content: '❌ Vous avez déjà un ticket ouvert.', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      // Création du salon privé ticket avec le pseudo dans le nom
      const channel = await interaction.guild.channels.create({
        name: `ticket-${type}-${usernameFormatted}-${interaction.user.id}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: staffRoleId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle(`Ticket ${type}`)
        .setDescription(`🎫 Ticket **${type}** ouvert par <@${interaction.user.id}>.\nUn membre du staff vous répondra bientôt.`)
        .setColor('Blurple')
        .setTimestamp();

      await channel.send({ content: `<@&${staffRoleId}>`, embeds: [embed], components: [ticketButtons] });

      return interaction.editReply({ content: `✅ Votre ticket a été ouvert : ${channel}` });
    }

    // GESTION DU CLAIM
    if (interaction.customId === 'claim_ticket') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: '❌ Cette commande ne peut être utilisée que dans un ticket.', ephemeral: true });
      }

      if (!interaction.member.roles.cache.has(staffRoleId)) {
        return interaction.reply({ content: '❌ Vous devez être staff pour clamer un ticket.', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
        SendMessages: true,
        ViewChannel: true,
      });

      const claimEmbed = new EmbedBuilder()
        .setDescription(`✅ <@${interaction.user.id}> a pris en charge ce ticket.`)
        .setColor('Green')
        .setTimestamp();

      await interaction.channel.send({ embeds: [claimEmbed] });

      return interaction.editReply({ content: 'Vous avez bien clamé ce ticket.' });
    }

    // GESTION DU CLOSE
    if (interaction.customId === 'close_ticket') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: '❌ Cette commande ne peut être utilisée que dans un ticket.', ephemeral: true });
      }

      if (!interaction.member.roles.cache.has(staffRoleId)) {
        return interaction.reply({ content: '❌ Vous devez être staff pour fermer un ticket.', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      const closeEmbed = new EmbedBuilder()
        .setDescription(`🔒 Ce ticket sera fermé dans 5 secondes.`)
        .setColor('Red')
        .setTimestamp();

      await interaction.channel.send({ embeds: [closeEmbed] });

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 5000);

      return interaction.editReply({ content: 'Le ticket va être fermé.' });
    }
  });
};
