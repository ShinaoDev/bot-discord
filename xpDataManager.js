const fs = require("fs");
const path = require("path");

const xpFile = path.join(__dirname, "xp.json");

// Vérifie que le fichier existe sinon le crée
if (!fs.existsSync(xpFile)) {
    fs.writeFileSync(xpFile, JSON.stringify({}));
}

function loadXP() {
    return JSON.parse(fs.readFileSync(xpFile));
}

function saveXP(data) {
    fs.writeFileSync(xpFile, JSON.stringify(data, null, 2));
}

function addXP(guildId, userId, amount) {
    let data = loadXP();
    if (!data[guildId]) data[guildId] = { users: {}, rewards: {}, afkChannels: [], enabled: false, rewardChannel: null };
    if (!data[guildId].users[userId]) data[guildId].users[userId] = { xp: 0 };

    data[guildId].users[userId].xp += amount;
    saveXP(data);
    return data[guildId].users[userId].xp;
}

function resetXP(guildId, userId) {
    let data = loadXP();
    if (data[guildId] && data[guildId].users[userId]) {
        data[guildId].users[userId].xp = 0;
        saveXP(data);
    }
}

function getXP(guildId, userId) {
    let data = loadXP();
    return data[guildId]?.users[userId]?.xp || 0;
}

function getLevel(xp) {
    return Math.floor(0.1 * Math.sqrt(xp));
}

module.exports = {
    loadXP,
    saveXP,
    addXP,
    resetXP,
    getXP,
    getLevel
};
