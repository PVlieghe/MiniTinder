const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const { body } = require('express-validator');
const guard = require('express-jwt-permissions')({
  requestProperty: 'auth',
});





router.get('/', async (req, res) => {
  res.send(await userRepository.getUsers());
});


router.get('/search', async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.auth.id);
    console.log('User:', user); // Vérifier la valeur de l'utilisateur récupéré
    const criteria = { "id": user.id,"genre": user.gender, "orientation": user.orientation };
    const filteredUsers = await userRepository.getUserByCriteria(criteria);
    // console.log('Filtered Users:', filteredUsers); // Vérifier les utilisateurs filtrés
      res.send(filteredUsers);
  } catch (error) {
    console.error('Une erreur s\'est produite:', error); // Afficher l'erreur détaillée dans la console
    res.status(500).send('Une erreur s\'est produite');
  }
});

router.get('/conn', async (req, res) => {
  const idConnUser = req.auth.id;

  if (!idConnUser) {
    res.status(500).send('authRoute: User connected not found');
    return;
  }

  res.json({id : idConnUser});
});

router.get('/:id', /*guard.check('admin'),*/ async (req, res) => {
  const foundUser = await userRepository.getUserById(req.params.id);

  if (!foundUser) {
    res.status(500).send('User not found');
    return;
  }

  res.send(foundUser);
});





router.post('/', 
  body('username').notEmpty().withMessage('Le champ "Nom d\'utilisateur" est requis.'),
  body('email').notEmpty().withMessage('Le champ "Email" est requis.')
    .isEmail().withMessage('Veuillez saisir une adresse email valide.')
    .custom(async (value) => {
      const existingUser = await userRepository.getUserByEmail(value);
      if (existingUser) {
        throw new Error('Cette adresse e-mail est déjà utilisée.');
      }
    }),
  body('password').notEmpty().withMessage('Le champ "Mot de passe" est requis.')
    .isLength({ min: 5 }).withMessage('Le mot de passe doit comporter au moins 5 caractères.'),
  body('age').notEmpty().withMessage('Le champ "Âge" est requis.'),
  body('gender').notEmpty().withMessage('Le champ "Genre" est requis.'),
  body('orientation').notEmpty().withMessage('Le champ "Orientation" est requis.'),
  body('global_desc').notEmpty().withMessage('Le champ "Description globale" est requis.'),
  body('photoProfilUrl').notEmpty().withMessage('Le champ "URL de la photo de profil" est requis.')
,
    async (req, res) => {
      console.log("route");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        const errorMessages = errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }));
        return res.status(400).json({ errors: errorMessages });}


      await userRepository.createUser(req.body);

      res.send({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);



router.put('/:id', /*guard.check('admin'),*/ async (req, res) => {
  await userRepository.updateUser(req.params.id, req.body).catch((err) => res.status(500).send(err.message));
  res.status(204).end();
});

router.delete('/:id', /*guard.check('admin',*/ async (req, res) => {
  await userRepository.deleteUser(req.params.id);
  res.status(204).end();
});




exports.initializeRoutes = () => router;
