const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇 Mute un membre de façon permanente.')
    .addUserOption(option => 
      option.setName('membre').setDescription('👤 Membre à mute').setRequired(true))
    .addStringOption(option =>
      option.setName('raison').setDescription('✍️ Raison du mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('membre');
    let reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Je ne peux pas mute ce membre.', ephemeral: false });
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
      await member.send(`🔇 Tu as été **mute** dans **${interaction.guild.name}**.\n📄 Raison : ${reason}`);
    } catch {
      console.log('❗ Impossible d’envoyer un MP au membre.');
    }

    interaction.reply({ content: `✅ ${member} a été mute.\n📄 Raison : **${reason}**` });
  }
};
