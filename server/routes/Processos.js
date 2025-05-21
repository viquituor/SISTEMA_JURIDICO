const express = require('express');
const router = express.Router({mergeParams: true});
const Processoscontroller = require('../controllers/Processos');

router.get('/Processos', Processoscontroller.buscarProcessos);
router.post('/Processos/:cod_contrato', Processoscontroller.addProcesso);
router.delete('/Processos/:num_processo', Processoscontroller.deleteProcesso);
router.put('/Processos/:num_processo', Processoscontroller.editarProcesso);

module.exports = router;