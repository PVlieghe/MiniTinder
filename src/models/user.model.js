const { DataTypes } = require('sequelize');
const { sequelize } = require('./sqlite.db');



const User = sequelize.define(
  'User', 
  {
    id: { primaryKey: true, type: DataTypes.UUID },
    email: { type: DataTypes.STRING, allowNull: false,  },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false},
    gender: { type: DataTypes.INTEGER, allowNull: false },
    orientation: { type: DataTypes.INTEGER, allowNull: false },
    global_desc:{type: DataTypes.STRING, allowNull: false},
    photoProfilUrl: {type: DataTypes.STRING, required: true}
  }, 
  { tableName: 'user' }
);

module.exports = User;