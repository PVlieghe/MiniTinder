const { DataTypes } = require('sequelize');
const { sequelize } = require('./sqlite.db');

const Relation = sequelize.define('Relation', {
  id: { primaryKey: true, type: DataTypes.UUID },

  user1Id: { type: DataTypes.STRING, allowNull: false,},

  user2Id: { type: DataTypes.STRING, allowNull: false,},

  like: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},

}, {
  tableName: 'relation'
});



module.exports = Relation;