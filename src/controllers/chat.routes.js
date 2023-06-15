const express = require ('express');
const router = express.Router();
const { validationResult } = require ('express-validator');
const chatRepository = require ('../models/chat-repository');
const { body } = require('express-validator');

router.get('/', async (req, res) => {
    res.send(await chatRepository.getChats());
});

router.get('/user', async (req, res) => {
    try {
      const dataChats = await chatRepository.getChatsByUser(req.auth.id);
  
      if (!dataChats) {
        return res.status(404).json({ error: 'Aucun chat disponible pour cet utilisateur.' });
      }
  
      res.send(dataChats);
    } catch (error) {
      console.error('chat route: Une erreur s\'est produite lors de la récupération des chats par utilisateur :', error);
      res.status(500).json({ error: ' chat route: Une erreur s\'est produite lors de la récupération des chats.' });
    }
  });

exports.initializeRoutes = () => router;