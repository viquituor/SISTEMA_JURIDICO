const Pagamentos = require('../models/Pagamentos');

exports.listaContratos = async (req, res, next) => {
    try {
        const contratos = await Pagamentos.buscarContratos(req.params.oab);
        res.json(contratos);
    } catch (err) {
        next(err);
    }
}

exports.listaPagamentos = async (req, res, next) => {
    try {
        const pagamentos = await Pagamentos.listarPagamentos(req.params.cod_contrato);
        res.json(pagamentos);
    } catch (err) {
        next(err);
    }
}