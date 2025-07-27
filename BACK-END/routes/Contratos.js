const express = require('express');
const router = express.Router({mergeParams: true});
const contratosController = require('../controllers/Contratos');

router.get('/Contratos', contratosController.listarContratosPorOAB);
router.get('/Contratos/:cod_contrato', contratosController.listarPorContrato);
router.delete('/Contratos/:cod_contrato', contratosController.deletarContrato);
router.put('/Contratos/:cod_contrato/cancelar', contratosController.cancelarContrato);
router.post('/Contratos', contratosController.criarContrato);
router.put('/Contratos/:cod_contrato', contratosController.atualizarContrato);
router.post('/Contratos/:cod_contrato/doc', contratosController.addArquivos);
router.get('/documentos/:cod_doc', contratosController.downloadDocumento)
router.delete('/documentos/:cod_doc', contratosController.excluirDocumento)

module.exports = router;