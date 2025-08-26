require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates // <-- IMPORTANT pour logs vocaux
  ]
});

client.commands = new Collection();

// Charger les commandes
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] La commande ${file} est invalide.`);
  }
}

require('./events/xp')(client);
require('./events/voiceXp')(client);


// Charger les logs
require('./events/logs')(client);

// Import et branchement des événements guildMemberAdd et guildMemberRemove
const guildMemberAdd = require('./events/guildMemberAdd');
const guildMemberRemove = require('./events/guildMemberRemove');

client.on('guildMemberAdd', member => guildMemberAdd.execute(member));
client.on('guildMemberRemove', member => guildMemberRemove.execute(member));

// Event ticketButtons (si tu as ce fichier)
require('./events/ticketButtons')(client);

// Quand le bot est prêt
client.once(Events.ClientReady, () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  client.user.setPresence({
    activities: [{
      name: 'made by izox___',
      type: ActivityType.Streaming,
      url: 'https://twitch.tv/izox'
    }],
    status: 'online'
  });
});

// Slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
  }
});

// Auto-replies
const autoReplies = {
  tg: 'Toi tg.',
  ftg: 'Je vais t\'attraper.',
  chocolatine: 'Pain au chocolat la putain de ta race !',
  fdp: 'Je prends ta mère pour 10 balles.',
  yo: 'Yo mec.',
  uwu: 'Alors non, on ban des gens pour moins que ça 🤡.',
  feur: 'Ferme-là ! T’es insupportable à la fin ! 😠',
  stiti: '**Roh ta gueule** !',
  pardon: 'Tu vois que tu peux être poli.',
  'excuse moi': 'T’inquiète pas, t’es pardonné :)'
};

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.toLowerCase().trim();

  const sortedKeys = Object.keys(autoReplies).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (key.includes(' ')) {
      if (content.includes(key)) {
        await message.reply(autoReplies[key]);
        break;
      }
    } else {
      const words = content.split(/\s+/);
      if (words.includes(key)) {
        await message.reply(autoReplies[key]);
        break;
      }
    }
  }
});

client.login(process.env.TOKEN);
