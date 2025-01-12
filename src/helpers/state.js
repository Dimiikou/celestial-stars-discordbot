let memberCount = 0;

function setMemberCount(count) {
    memberCount = count;
}

function getMemberCount() {
    return memberCount;
}

module.exports = {
    memberCount,
    setMemberCount,
    getMemberCount
};