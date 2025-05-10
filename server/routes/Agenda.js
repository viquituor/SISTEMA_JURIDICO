const express = require('express');
const router = express.Router({mergeParams: true});
const agendaController = require('../controllers/Agenda');

// Rotas da Agenda
router.get('/Agenda', agendaController.buscarCompromissos);
router.post('/Agenda', agendaController.criarCompromisso);
router.delete('/Agenda/:cod_compromisso', agendaController.deletarCompromisso);
router.put('/Agenda/:cod_compromisso', agendaController.editarCompromisso);


module.exports = router;