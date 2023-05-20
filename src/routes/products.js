const express = require('express');

const productsCtrl = require('../controllers/ProductsController');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware');

const app = express.Router();

app.get('/products', productsCtrl.getAllProduct);
app.post('/products', jwtAuthMiddleware, productsCtrl.addProduct);
app.get('/products/:id', productsCtrl.getProduct);
app.put('/products/:id', jwtAuthMiddleware, productsCtrl.updateProduct);
app.delete('/products/:id', jwtAuthMiddleware, productsCtrl.deleteProduct);

module.exports = app;
