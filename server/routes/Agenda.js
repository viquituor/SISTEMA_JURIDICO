const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/Agenda');

// Rotas da Agenda
router.get('/:oab/compromissos', agendaController.buscarCompromissos);
router.get('/:oab/contratos', agendaController.buscarContratosDisponiveis);
router.post('/:oab/compromissos', agendaController.criarCompromisso);
router.put('/:oab/compromissos/:cod_compromisso', agendaController.atualizarCompromisso);
router.delete('/:oab/compromissos/:cod_compromisso', agendaController.deletarCompromisso);

module.exports = router;