const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true }, // Hapus unique: true
    username: { type: DataTypes.STRING, allowNull: true }, // Hapus unique: true
    password: { type: DataTypes.STRING, allowNull: false },
    
    bio: { type: DataTypes.STRING, allowNull:true },
    role: { 
        type: DataTypes.ENUM('user', 'teman_tuli', 'teman_dengar', 'ahli_bahasa'),
        defaultValue: 'user'
    },
    gender: { 
        type: DataTypes.ENUM('Laki-Laki', 'Perempuan'),
        defaultValue: 'Laki-Laki',
        
    },
      Image: {
    type: DataTypes.TEXT, // ini base64
    allowNull: true,
    
  },
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

module.exports = User;
