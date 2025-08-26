const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Unmute un membre.')
    .addUserOption(option => 
      option.setName('membre').setDescription('👤 Membre à unmute').setRequired(true))
    .addStringOption(option =>
      option.setName('raison').setDescription('✍️ Raison du unmute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('membre');
    let reason = interaction.options.getString('raison') || 'Aucune raison fournie';

    const mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole || !member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: '❌ Ce membre n’est pas mute ou le rôle Muted est introuvable.', ephemeral: false });
    }

    await member.roles.remove(mutedRole, reason);

    try {
      await member.send(`🔊 Tu as été **unmute** dans **${interaction.guild.name}**.\n📄 Raison : ${reason}`);
    } catch {}

    interaction.reply({ content: `✅ ${member} a été unmute.\n📄 Raison : **${reason}**` });
  }
};
