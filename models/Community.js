const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const CommunityMember = require("./CommunityMember");

const Community = sequelize.define("Community", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

  foto: {
    type: DataTypes.TEXT, // ini base64
    allowNull: true,
  },
    
});

Community.hasMany(CommunityMember, { foreignKey: "communityId", as: "members" });
CommunityMember.belongsTo(Community, { foreignKey: "communityId", as: "community" });

module.exports = Community;
