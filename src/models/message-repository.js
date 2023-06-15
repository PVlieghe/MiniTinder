const uuid = require ('uuid');
const Message = require ('./relation.model');
const Chat = require ('./user.model');
const { Op } = require('sequelize');
const chat = require('./chat-repository');

exports.getMessages = async () => await Message.findAll();

exports.getMessagesByChat = async (chatId) => {
    return await Message.findAll({ where: { chatId: chatId } });
};

exports.getRelationByUser1 = async (userId) => {
    return await Relation.findAll({ where : { userId: userId } });
};

exports.createMessage = async (idChat, user, content) => {
    const message = {
        "userId": user,
        "chatId": idChat,
        "id": uuid.v4(),
        "content": content
    };

    await Message.create(message);

}