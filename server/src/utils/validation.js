const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateNickname = (nickname) => {
  if (!nickname || typeof nickname !== 'string' || nickname.trim().length < 3) {
    return { valid: false, message: 'Nickname must be at least 3 characters long and cannot be empty.' };
  }
  return { valid: true };
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return { valid: false, message: 'Email is not valid or cannot be empty.' };
  }
  return { valid: true };
};

module.exports = { validateNickname, validateEmail };