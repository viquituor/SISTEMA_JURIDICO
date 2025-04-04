const express = require('express');
const router = express.Router();
const advogadosController = require('../controllers/advogados');

router.get('/', advogadosController.listarAdvogados);
router.get('/:oab', advogadosController.buscarAdvogado);
router.post('/', advogadosController.criarAdvogado);
router.put('/:oab', advogadosController.atualizarAdvogado);
router.delete('/:oab', advogadosController.deletarAdvogado);

module.exports = router;