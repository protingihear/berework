const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const TemanDengar = sequelize.define('TemanDengar', {
    idTemanDengar: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});

User.hasOne(TemanDengar, { foreignKey: 'userId' });
TemanDengar.belongsTo(User, { foreignKey: 'userId' });

module.exports = TemanDengar;
