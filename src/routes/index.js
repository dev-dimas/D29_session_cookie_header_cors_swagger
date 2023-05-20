const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../docs/swagger.json');

const app = express.Router();

app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDoc));

module.exports = app;
