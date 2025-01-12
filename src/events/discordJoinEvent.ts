import {EmbedBuilder, Guild, GuildBasedChannel, GuildMember} from "discord.js";

const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(guildMember: GuildMember) {
        const welcomeChannel: GuildBasedChannel = getChannelById(guildMember.guild, "1327672068396810312");

        if (welcomeChannel && welcomeChannel.isTextBased()) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x957DAD)
                .setAuthor({name: guildMember.user.displayName, iconURL: guildMember.user.avatarURL()})
                .setDescription(`### :tada: Herzlich Willkommen! :tada:\n` +
                    `Wir freuen uns dich als unser ${guildMember.guild.memberCount - 1}. Mitglied auf unserem Discord-Server begrüßen zu dürfen! \n` +
                    'Mach es dir gemütlich und viel Spaß!');

            await welcomeChannel.send({embeds: [exampleEmbed]});
        }

        const memberCountChannel: GuildBasedChannel = getChannelById(guildMember.guild, "1327664288160022621");
        await memberCountChannel.setName(memberCountChannel.name.replace(/(\d+)/, (guildMember.guild.memberCount - 1).toString()))
    },
};

function getChannelById(guild: Guild, id: string): GuildBasedChannel {
    return guild.channels.cache.find(memberCountChannel => memberCountChannel.id === id);
}