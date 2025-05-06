const Agenda = require('../models/Agenda');


exports.buscarCompromissos = async (req, res, next) => {
    try {
        const { oab } = req.params;
        const compromissos = await Agenda.buscarCompromissos(oab);
        res.json(compromissos);
    } catch (err) {
        next(err);
    }
};

