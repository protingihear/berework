const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    }
});

module.exports = Community;
