const uuid = require ('uuid');
const Relation = require ('./relation-repository');
const Chat = require ('./chat.model');
const { Op } = require('sequelize');

exports.getChats = async () => await Chat.findAll();

exports.createChat = async(user1Id, user2Id) => {
    if(Relation.verifyRelationByUsers(user1Id, user2Id) && Relation.verifyRelationByUsers(user2Id, user1Id)){
        const chat = {
            "user1Id": user1Id,
            "user2Id": user2Id,
            "id": uuid.v4()
        }
    
        await Chat.create(chat);
    }
    else{console.log("pas de chat créable")} 
}


//renvoie l'id du chat et l'id de "l'autre" utilisateur

exports.getChatsByUser = async (userId) => {
  try {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    const result = [];

    for (const chat of chats) {
      const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      result.push({
        chatId: chat.id,
        userId: otherUserId
      });
    }

    return result;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des chats :", error);
    throw error;
  }
};
