const jwt = require('jsonwebtoken');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  req.user = payload;

  next();
};
