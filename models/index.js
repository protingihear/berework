const sequelize = require('../config/database');
const User = require('./user');
const TemanTuli = require('./TemanTuli');
const TemanDengar = require('./TemanDengar');
const AhliBahasa = require('./AhliBahasa');

const db = { sequelize, User, TemanTuli, TemanDengar, AhliBahasa };

module.exports = db;
