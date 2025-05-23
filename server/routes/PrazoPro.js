const express = require('express');
const router = express.Router({mergeParams: true});
const PrazoController = require('../controllers/PrazoPro');

// Rotas da Agenda
router.get('/Prazo', PrazoController.buscarPrazos);
router.post('/Prazo', PrazoController.criarPrazo);
router.delete('/Prazo/:cod_prapro', PrazoController.deletarPrazo);
router.put('/Prazo/:cod_prapro', PrazoController.editarPrazo);


module.exports = router;