const {setMemberCount} = require( "../helpers/state.js");
const {guildId} = require('../configs/config.json');
const {Events} = require('discord.js');
import { startServer } from '../webhooks/streamOnline.js';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            setMemberCount(guild.memberCount);
        }

        console.log(`Ready! Logged in as ${client.user.tag}`);
        startServer();
    },
};