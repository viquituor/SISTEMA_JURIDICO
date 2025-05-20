const express = require('express');
const router = express.Router({mergeParams: true});
const Processoscontroller = require('../controllers/Processos');

router.get('/Processos', Processoscontroller.buscarProcessos);
router.post('/Processos/:cod_contrato', Processoscontroller.addProcesso);

module.exports = router;