const fs = require('fs');
const path = require('path');
const { EmbedBuilder, Events } = require('discord.js');

module.exports = (client) => {
  const filePath = path.join(__dirname, '../data/logs.json');
  let logsData = {};
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      logsData = content.length ? JSON.parse(content) : {};
    } catch (err) {
      console.error(err);
    }
  }

  function getLogChannel(guild) {
    const channelId = logsData[guild.id];
    if (!channelId) return null;
    return guild.channels.cache.get(channelId);
  }

  // Message supprimé + ghost ping
  client.on(Events.MessageDelete, async (message) => {
    if (!message.guild || message.author?.bot) return;

    const channel = getLogChannel(message.guild);
    if (!channel) return;

    
    // Ghost ping detection (message avec mention supprimé)
    if (message.mentions.users.size > 0) {
      message.channel.send(`${message.author} arrête de ghost ping.`)
    .then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    })
      .catch(console.error);
    }



    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Message supprimé')
      .addFields(
        { name: 'Auteur', value: `${message.author.tag} (${message.author.id})`, inline: true },
        { name: 'Salon', value: `${message.channel}`, inline: true },
        { name: 'Message', value: message.content ? message.content.slice(0, 1024) : '[Pas de contenu]' }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Message édité
  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const channel = getLogChannel(oldMessage.guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Message édité')
      .addFields(
        { name: 'Auteur', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
        { name: 'Salon', value: `${oldMessage.channel}`, inline: true },
        { name: 'Avant', value: oldMessage.content.slice(0, 1024) || '[Pas de contenu]' },
        { name: 'Après', value: newMessage.content.slice(0, 1024) || '[Pas de contenu]' }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Membre rejoint
  client.on(Events.GuildMemberAdd, async (member) => {
    const channel = getLogChannel(member.guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Membre rejoint')
      .setDescription(`${member.user.tag} a rejoint le serveur.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: member.id, inline: true },
        { name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Membre quitté
  client.on(Events.GuildMemberRemove, async (member) => {
    const channel = getLogChannel(member.guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('Membre quitté')
      .setDescription(`${member.user.tag} a quitté le serveur.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: member.id, inline: true },
        { name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Logs vocaux (entrée, sortie, changement)
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!oldState.guild) return;

    const channel = getLogChannel(oldState.guild);
    if (!channel) return;

    const user = newState.member.user;

    if (!oldState.channel && newState.channel) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Entrée en vocal')
        .setDescription(`${user.tag} a rejoint le canal vocal ${newState.channel.name}.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      channel.send({ embeds: [embed] }).catch(console.error);
    } else if (oldState.channel && !newState.channel) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Sortie du vocal')
        .setDescription(`${user.tag} a quitté le canal vocal ${oldState.channel.name}.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      channel.send({ embeds: [embed] }).catch(console.error);
    } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Changement de canal vocal')
        .setDescription(`${user.tag} est passé de ${oldState.channel.name} à ${newState.channel.name}.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      channel.send({ embeds: [embed] }).catch(console.error);
    }
  });

  // Commande exécutée
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const channel = getLogChannel(interaction.guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Commande exécutée')
      .setDescription(`${interaction.user.tag} a exécuté la commande \`/${interaction.commandName}\`.`)
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(console.error);
  });
};
