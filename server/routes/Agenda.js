const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/Agenda');

// Rotas da Agenda
router.get('/:oab/Agenda/compromissos', agendaController.buscarCompromissos);
router.get('/:oab/Agenda/contratos', agendaController.buscarContratosDisponiveis);
router.post('/:oab/Agenda/compromissos', agendaController.criarCompromisso);
router.put('/:oab/Agenda/compromissos/:cod_compromisso', agendaController.atualizarCompromisso);
router.delete('/:oab/Agenda/compromissos/:cod_compromisso', agendaController.deletarCompromisso);

module.exports = router;