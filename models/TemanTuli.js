const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const TemanTuli = sequelize.define('TemanTuli', {
    idTemanTuli: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});

User.hasOne(TemanTuli, { foreignKey: 'userId' });
TemanTuli.belongsTo(User, { foreignKey: 'userId' });

module.exports = TemanTuli;
