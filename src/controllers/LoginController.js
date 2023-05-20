const jwt = require('jsonwebtoken');

const getUser = (username, password) => {
  const user = { username: 'admin', password: 'admin' };
  if (username === user.username && password === user.password) {
    return user;
  }
  return undefined;
};

const getLogged = (req, res, next) => {
  const { username, password } = req.body;
  const user = getUser(username, password);
  try {
    if (!username || !password) {
      const error = new Error('Bad request!.');
      error.status = 400;
      throw error;
    }
    if (!user) {
      const error = new Error('Invalid credentials!.');
      error.status = 403;
      throw error;
    }
    delete user.password;
    const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    res.cookie('accessToken', accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send({ message: 'Login success.', error: false });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogged };
