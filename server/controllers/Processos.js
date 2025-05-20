const Processos = require('../models/Processos');

exports.buscarProcessos = async(req, res, next) => {
try {
        const response = await Processos.listarProcessos(req.params.oab);
        res.json(response);
    } catch (err) {
        next(err);
    }
}