import {Guild, GuildBan, GuildBasedChannel} from "discord.js";
import {memberCount, setMemberCount} from "../helpers/state";

const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildBanAdd,
    async execute(guildBan: GuildBan) {
        setMemberCount(memberCount - 1);

        const memberCountChannel: GuildBasedChannel = getChannelById(guildBan.guild, "1327664288160022621");
        await memberCountChannel.setName(memberCountChannel.name.replace(/(\d+)/, (guildBan.guild.memberCount - 1).toString()));
    },
};

function getChannelById(guild: Guild, id: string): GuildBasedChannel {
    return guild.channels.cache.find(memberCountChannel => memberCountChannel.id === id);
}