require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');

const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const homeRoute = require('./routes');
const loginRoute = require('./routes/login');
const employeesRoute = require('./routes/employees');
const productsRoute = require('./routes/products');

const app = express();
const upload = multer({ dest: path.resolve('tmp') });

app.use(cors({ origin: '*' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());

app.use('/', homeRoute);
app.use(loginRoute);
app.use(employeesRoute);
app.use(productsRoute);
app.use('/images', express.static('public/images'));

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
