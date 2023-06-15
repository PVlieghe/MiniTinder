const uuid = require('uuid');
const { generateHashedPassword } = require('../security/crypto');
const User = require('./user.model');
const Relation = require ('./relation.model');


exports.getUsers = async () => await User.findAll();

exports.getUserById = async (id) => {
  return await User.findOne({ where: { id } });
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.getUser2ByRelations = async (user1Id) => {
  const relations = await Relation.findAll({ where: { user1Id: user1Id } });
  const user2Ids = relations.map((relation) => relation.user2Id);
  return user2Ids;
};

exports.getUserByCriteria = async (criteria) => {
  const usersJson = await User.findAll();

  const relationUser = await this.getUser2ByRelations(criteria.id)
  
  const filteredUsers = usersJson.filter((user) => {
    if (criteria.genre) {
      switch (criteria.genre) {
        case 1: // Femme
          switch (criteria.orientation) {
            case 1: // Aime homme
              return user.gender === 2 && (user.orientation === 2 || user.orientation === 3);
            case 2: // Aime femme
              return user.gender === 1 && (user.orientation === 2 || user.orientation === 3);
            case 3: // Aime les deux
              return user.orientation === 2 || user.orientation === 3;
          }
        case 2: // Homme
          switch (criteria.orientation) {
            case 1: // Aime homme
              return user.gender === 2 && (user.orientation === 1 || user.orientation === 3);
            case 2: // Aime femme
              return user.gender === 1 && (user.orientation === 1 || user.orientation === 3);
            case 3: // Aime les deux
              return user.orientation === 1 || user.orientation === 3;
          }
      }
    }
  });


  // Ajout d'un tableau qui contient les utilisateurs selon leur genre/orientation et 
  // surtout s'ils n'ont pas rencontrés l'utilisateur connecté.
  const filteredUsersWithoutRelations = [];
  filteredUsers.forEach((user) => {
    if (!relationUser.includes(user.id)) {
      filteredUsersWithoutRelations.push(user);
    }
  });

  // suppression de l'utilisateur connecté dans le tableau de choix 
  filteredUsersWithoutRelations.forEach((user, index) => {
    if (user.id === criteria.id) {
      filteredUsersWithoutRelations.splice(index, 1); 
    }
  });

  
  console.log("utilisateurs 'disponibles'")
  filteredUsersWithoutRelations.forEach((user) => {
    console.log(user.username);
  });

  
  return filteredUsersWithoutRelations;
};

exports.createUser = async (body) => {
  const hashedPassword = generateHashedPassword(body.password);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  await User.create(user);
};



exports.updateUser = async (id, data) => {
  const foundUser = await User.findOne({ where: {id} });

  if (!foundUser) {
    throw new Error('User not found');
  }

  await User.update({
    username: data.username || foundUser.username,
    email: data.email || foundUser.email,
    orientation: data.orientation || foundUser.orientation,
    age: data.age || foundUser.age,
    global_desc: data.global_desc || foundUser.global_desc,
    password: data.password ? generateHashedPassword(data.password) : foundUser.password,
  }, { where: { id } });
};

exports.deleteUser = async (id) => {

  await relation.deleteRelationsByUser (id);
  await User.destroy({ where: { id } });

};
