const express = require('express');
const router = express.Router({mergeParams: true});
const Processoscontroller = require('../controllers/Processos');

router.get('/Processos', Processoscontroller.buscarProcessos)

module.exports = router;