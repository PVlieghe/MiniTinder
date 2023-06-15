const { DataTypes } = require('sequelize');
const { sequelize } = require('./sqlite.db');

const Chat = sequelize.define('Chat', {
  id: { primaryKey: true, type: DataTypes.UUID },

  user1Id: { type: DataTypes.STRING, allowNull: false,},

  user2Id: { type: DataTypes.STRING, allowNull: false,},

}, {
  tableName: 'chat'
});



module.exports = Chat;