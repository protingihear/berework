const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE
, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
     port: process.env.DB_PORT || 3306,
    host: process.env.MYSQLHOST,
    dialect: 'mysql',
    logging: false,
    
});

module.exports = sequelize;
