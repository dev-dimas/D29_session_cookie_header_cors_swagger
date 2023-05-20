const express = require('express');

const employeesCtrl = require('../controllers/EmployeesController');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware');

const app = express.Router();

app.get('/employees', employeesCtrl.getAllEmployee);
app.post('/employees', jwtAuthMiddleware, employeesCtrl.addEmployee);
app.get('/employees/:id', employeesCtrl.getEmployee);
app.put('/employees/:id', jwtAuthMiddleware, employeesCtrl.updateEmployee);
app.delete('/employees/:id', jwtAuthMiddleware, employeesCtrl.deleteEmployee);

module.exports = app;
