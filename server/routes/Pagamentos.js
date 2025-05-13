const express = require('express');
const router = express.Router({mergeParams: true});
const PagamentosController = require('../controllers/Pagamentos');

router.get('/Pagamentos', PagamentosController.listaContratos);
router.get('/Pagamentos/:cod_contrato', PagamentosController.listaPagamentos);


module.exports = router;