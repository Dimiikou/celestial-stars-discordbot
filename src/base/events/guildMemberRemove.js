const {memberCount, setMemberCount} = require("../helpers/state.js");
const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(guildMember) {
        setMemberCount(memberCount - 1);

        const memberCountChannel = getChannelById(guildMember.guild, "1327664288160022621");
        await memberCountChannel.setName(memberCountChannel.name.replace(/(\d+)/, (guildMember.guild.memberCount - 1).toString()));
    },
};

function getChannelById(guild, id) {
    return guild.channels.cache.find(memberCountChannel => memberCountChannel.id === id);
}