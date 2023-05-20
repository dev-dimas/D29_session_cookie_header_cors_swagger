const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  req.headers.authorization = `Bearer ${req.cookies.accessToken}`;
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ') || !req.cookies.accessToken) {
      const error = new Error('Unauthorized!.');
      error.status = 401;
      throw error;
    }
    const accessToken = authHeader.slice(7);
    const user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('accessToken');
    next(error);
  }
};

module.exports = authMiddleware;
