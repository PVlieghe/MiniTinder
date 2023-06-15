const bcrypt = require('bcryptjs');

exports.generateHashedPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

exports.passwordsAreEqual = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};
