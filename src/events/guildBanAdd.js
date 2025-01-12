const {memberCount, setMemberCount} = require("../helpers/state.js");
const {Events} = require("discord.js");

module.exports = {
    name: Events.GuildBanAdd,
    async execute(guildBan) {
        setMemberCount(memberCount - 1);

        const memberCountChannel = getChannelById(guildBan.guild, "1327664288160022621");
        await memberCountChannel.setName(memberCountChannel.name.replace(/(\d+)/, (guildBan.guild.memberCount - 1).toString()));
    },
};

function getChannelById(guild, id) {
    return guild.channels.cache.find(memberCountChannel => memberCountChannel.id === id);
}