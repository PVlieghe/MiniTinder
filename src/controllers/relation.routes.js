const express = require ('express');
const router = express.Router();
const { validationResult } = require ('express-validator');
const relationRepository = require ('../models/relation-repository');
const { body } = require('express-validator');

router.get('/', async (req, res) => {
    res.send(await relationRepository.getRelations());
});

router.get('/user/:id', async (req, res) => {
    try {
      const userId = req.params.userId; 
  
      // Utilisez la fonction "getRelationByUser" du "relationRepository" pour obtenir les relations de l'utilisateur
      const relations = await relationRepository.getRelationByUser(userId);
  
      // Répondez avec les relations obtenues
      res.json(relations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des relations de l\'utilisateur.' });
    }
  });

  router.get('/:id', async (req, res) => {
    const foundRelation = await relationRepository.getRelationById(req.params.id);

    if(!foundRelation){
        res.status(500).send('User nor found');
        return;
    }

    res.send(foundRelation);
  });

  router.post('/',
  body('user2Id').notEmpty(),
  body('like').isBoolean(),
  async (req, res) => {
    
    try {
      const user1 = req.auth.id;
      console.log(user1);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Utilisez la fonction "createRelation" du "relationRepository" en passant le corps de la requête en paramètre
      await relationRepository.createRelation(req.body, user1);
      console.log("relation.route: relation créée avec succès")

      // Répondez avec la nouvelle relation créée
      res.status(200).json({ message: req.body });
    } catch (error) {
      console.error(error);
      
      res.status(500).json({ message: 'Une erreur est survenue lors de la création de la relation.' });
    }
  }

);

router.delete('/', async (req, res) => {
  try {
    await deleteAllRelations();
    res.status(200).json({ message: 'Toutes les relations ont été supprimées avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression des relations.' });
  }
});

exports.initializeRoutes = () => router;