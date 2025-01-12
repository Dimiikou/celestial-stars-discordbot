﻿import {Guild, GuildBasedChannel, GuildMember, PartialGuildMember} from "discord.js";
import {memberCount, setMemberCount} from "../helpers/state";

const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(guildMember: GuildMember | PartialGuildMember) {
        setMemberCount(memberCount - 1);

        const memberCountChannel: GuildBasedChannel = getChannelById(guildMember.guild, "1327664288160022621");
        await memberCountChannel.setName(memberCountChannel.name.replace(/(\d+)/, (guildMember.guild.memberCount - 1).toString()));
    },
};

function getChannelById(guild: Guild, id: string): GuildBasedChannel {
    return guild.channels.cache.find(memberCountChannel => memberCountChannel.id === id);
}