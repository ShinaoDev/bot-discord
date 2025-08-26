module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const triggers = {
      ftg: "Je vais t'attraper.",
      tg: 'Toi, TG.',
      chocolatine: 'Pain au chocolat, putain de ta race !',
      fdp: 'Je prends ta mère pour 10 balles.',
      yo: 'Yo mec.',
      uwu: 'Alors non, on ban des gens pour moins que ça.',
      feur: 'Ferme-la ! T’es insupportable à la fin !',
      stiti: '**ROH TA GUEULE !**',
      pardon: 'Tu vois que tu peux être poli.',
      'excuse moi': 'T’inquiète pas, t’es pardonné :)'
    };

    // On récupère le message en minuscule et on split en mots
    const content = message.content.toLowerCase();

    // On trie les triggers par longueur décroissante de la clé
    const sortedTriggers = Object.entries(triggers).sort((a, b) => b[0].length - a[0].length);

    for (const [key, reply] of sortedTriggers) {
      // Pour les triggers avec plusieurs mots (ex: "excuse moi")
      if (key.includes(' ')) {
        if (content.includes(key)) {
          await message.channel.send(reply);
          break;
        }
      } else {
        // Pour les mots simples, on découpe le contenu en mots pour un match exact
        const words = content.split(/\s+/);
        if (words.includes(key)) {
          await message.channel.send(reply);
          break;
        }
      }
    }
  }
};
