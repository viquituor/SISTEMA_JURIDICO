const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/Clientes');

router.get('/Clientes', clientesController.listarClientes);
router.delete('/Clientes/:cpf', clientesController.deletarCliente);
router.post('/Clientes', clientesController.criarCliente);
router.put('/Clientes/:cpf', clientesController.atualizarCliente);

module.exports = router;