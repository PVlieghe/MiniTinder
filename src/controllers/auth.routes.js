const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRepository = require('../models/user-repository');
const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');
const { body } = require('express-validator');

const { validateBody } = require('./validation/route.validator');




  router.post('/',
    body('email').notEmpty(),
    body('password').notEmpty(),
    async (req, res) => {
      try {
        validateBody(req);
      } catch (e) {
        res.status(500).send(e.message);
        return;
      }
  
    
  
      const user = await userRepository.getUserByEmail(req.body.email);
      if (user) {
          if (await passwordsAreEqual(req.body.password, user.password)) {
            const token = jwt.sign(
              {
                id: user.id, //req.auth.id piur récupérer l'id du user 
                userName: req.body.username,
                email: req.body.email,
              },
              process.env.JWT_SECRET,
              {expiresIn: process.env.JWT_EXPIRES_IN},
            );

             // Stockez le token dans req.auth pour l'utiliser ultérieurement
            req.auth = { id: user.id, token };
            console.log("req.auth:");
            console.log(req.auth);

            res.status(200).json({ token });
          } else {
            res.status(401).json("Le mot de passe saisi est incorrect")
        } 
      } else {
        res.status(400).json("L'adresse mail saisie n'est pas reconnue");
      }
    });


  


exports.initializeRoutes = () => router;