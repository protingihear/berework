const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityMember = sequelize.define("CommunityMember", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = CommunityMember;
