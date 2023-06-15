const { DataTypes } = require('sequelize');
const { sequelize } = require('./sqlite.db');

const Message = sequelize.define('Message', {
  id: { primaryKey: true, type: DataTypes.UUID },

  chatId: { type: DataTypes.STRING, allowNull: false,},

  userId: { type: DataTypes.STRING, allowNull: false,},

  content: { type: DataTypes.STRING, allowNull: false,},

}, {
  tableName: 'message'
});



module.exports = Message;