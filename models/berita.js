const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Berita = sequelize.define("Berita", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  foto: {
    type: DataTypes.TEXT, // ini base64
    allowNull: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Berita;
