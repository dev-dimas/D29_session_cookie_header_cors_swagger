const express = require('express');

const loginCtrl = require('../controllers/LoginController');

const app = express.Router();

app.post('/login', loginCtrl.getLogged);

module.exports = app;
