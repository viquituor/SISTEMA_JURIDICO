const express = require('express');
const router = express.Router({mergeParams: true});
const contratosController = require('../controllers/Contratos');

router.get('/Contratos', contratosController.listarContratosPorOAB);
router.get('/Contratos/:cod_contrato', contratosController.listarPorContrato);
router.delete('/Contratos/:cod_contrato', contratosController.deletarContrato);
router.post('/Contratos', contratosController.criarContrato);
router.put('/Contratos/:cod_contrato', contratosController.atualizarContrato);

module.exports = router;