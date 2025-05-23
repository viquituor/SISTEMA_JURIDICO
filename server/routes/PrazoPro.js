const express = require('express');
const router = express.Router({ mergeParams: true });
const PrazoController = require('../controllers/PrazoPro');

// Prazo routes
router.get('/Prazo', PrazoController.getAllPrazos);
router.get('/Prazo/:num_processo', PrazoController.getPrazosByProcesso);
router.post('/Prazo', PrazoController.createPrazo);
router.put('/Prazo/:cod_prapro', PrazoController.updatePrazo);
router.delete('/Prazo/:cod_prapro', PrazoController.deletePrazo);

module.exports = router;