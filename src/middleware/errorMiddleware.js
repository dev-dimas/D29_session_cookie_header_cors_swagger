const errorMiddleware = (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({ message: error.message, status: error.status, error: true });
};

module.exports = errorMiddleware;
