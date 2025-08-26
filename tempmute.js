const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempmute')
    .setDescription('⏳ Mute un membre temporairement.')
    .addUserOption(option => 
      option.setName('membre').setDescription('👤 Membre à mute').setRequired(true))
    .addStringOption(option =>
      option.setName('durée').setDescription('⏰ Durée (ex: 10m, 1h, 2d)').setRequired(true))
    .addStringOption(option =>
      option.setName('raison').setDescription('✍️ Raison du mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('membre');
    const durée = interaction.options.getString('durée');
    let reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    const durationMs = ms(durée);
    if (!durationMs || isNaN(durationMs)) {
      return interaction.reply({ content: '❌ Durée invalide.', ephemeral: false });
    }

    let mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) {
      try {
        mutedRole = await interaction.guild.roles.create({
          name: 'Muted',
          permissions: [],
          reason: '🔧 Création du rôle Muted automatique'
        });

        interaction.guild.channels.cache.forEach(channel => {
          channel.permissionOverwrites.create(mutedRole, {
            SendMessages: false,
            Speak: false,
            Connect: false
          });
        });
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: '⚠️ Erreur lors de la création du rôle Muted.', ephemeral: false });
      }
    }

    await member.roles.add(mutedRole, reason);

    try {
      await member.send(`⏳ Tu as été **temporairement mute** dans **${interaction.guild.name}** pour **${durée}**.\n📄 Raison : ${reason}`);
    } catch {
      console.log('❗ Impossible d’envoyer un MP au membre.');
    }

    interaction.reply({ content: `✅ ${member} a été mute temporairement pour **${durée}**.\n📄 Raison : **${reason}**` });

    setTimeout(async () => {
      if (member.roles.cache.has(mutedRole.id)) {
        await member.roles.remove(mutedRole, '⏰ Fin du tempmute');
        try {
          await member.send(`🔊 Tu as été **unmute automatiquement** dans **${interaction.guild.name}** après **${durée}**.`);
        } catch {}
      }
    }, durationMs);
  }
};
