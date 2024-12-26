const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const verifyPassword = async (password, hash) => {
  const validPass = await bcrypt.compare(password, hash);
  return validPass;
};

module.exports = {
  hashPassword,
  verifyPassword,
};
