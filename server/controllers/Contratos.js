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