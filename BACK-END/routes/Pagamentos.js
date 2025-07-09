const express = require('express');
const router = express.Router({mergeParams: true});
const PagamentosController = require('../controllers/Pagamentos');

router.get('/Pagamentos', PagamentosController.listaContratos);
router.get('/Pagamentos/:cod_contrato', PagamentosController.listaPagamentos);
router.post('/Pagamentos', PagamentosController.criarPagamento);
router.delete('/Pagamentos/:cod_pagamento', PagamentosController.deletarPagamento);
router.put('/Pagamentos/:cod_pagamento', PagamentosController.atualizarPagamento);


module.exports = router;