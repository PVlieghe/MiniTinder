const uuid = require ('uuid');
const Relation = require ('./relation.model');
const User = require ('./user.model');
const { Op } = require('sequelize');
const chat = require('./chat-repository');

exports.getRelations = async () => await Relation.findAll();

exports.getRelationById = async (id) => {
    return await Relation.findOne({ where: { id } });
};

exports.getRelationByUser1 = async (user1Id) => {
    return await Relation.findAll({ where : { user1Id: user1Id } });
};

exports.verifyRelationByUsers = async (user1Id, user2Id) => {
    const relation = await Relation.findOne({ 
        where: { 
            user1Id: user1Id,
            user2Id: user2Id,
            like: true
        }
    });

    if (!relation) {
        return false ;
    }

    return true;
};



exports.createRelation = async (body, user1) => {
    
    const relation = body;
    relation.id = uuid.v4();
    relation.user1Id = user1;

    await Relation.create(relation);
    await chat.createChat(user1, body.user2Id)
    
};

exports.deleteRelationsByUser = async (userId) => {
    await Relation.destroy({
        where: {
            [Op.or]: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        }
    });
}

exports.deleteRelation = async (id) => {

    await Relation.destroy( { where: { id }})
}

exports.deleteAllRelations = async () => {
    await Relation.destroy({
      where: {},
      truncate: true
    });
  };
