const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const AhliBahasa = sequelize.define('AhliBahasa', {
    idAhliBahasa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});

User.hasOne(AhliBahasa, { foreignKey: 'userId' });
AhliBahasa.belongsTo(User, { foreignKey: 'userId' });

module.exports = AhliBahasa;
