const Contratos = require('../models/Contratos');

exports.listarContratosPorOAB = async (req, res, next) => {
    try {
        const contratos = await Contratos.buscarTodos(req.params.oab);
        console.log("OAB recebida no back:", req.params.oab);
        res.json(contratos);
    } catch (err) {
        console.error("Erro no controller de contratos:", err);
        next(err);
    }
};

exports.listarCompromissosPorContrato = async (req, res, next) => {
    try {
        const compromissos = await Contratos.buscarCompromissos(req.params.cod_contrato);
        console.log("Código de contrato recebido no back:", req.params.cod_contrato);
        res.json(compromissos); // Corrigido para retornar a variável correta
    } catch (err) {
        console.error("Erro no controller de compromissos:", err);
        next(err);
    }
};

