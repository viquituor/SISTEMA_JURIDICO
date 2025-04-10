const express = require('express');
const router = express.Router({mergeParams: true});
const contratosController = require('../controllers/Contratos');

router.get('/Contratos', contratosController.listarContratosPorOAB);
router.get('/Contratos/:cod_contrato', contratosController.listarCompromissosPorContrato);

module.exports = router;