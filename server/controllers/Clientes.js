const Advogado = require('../models/Clientes');

exports.listarClientes = async (req, res, next) => {
    try {
        const clientes = await clientes.buscarTodos();
        res.json(clientes);
    } catch (err) {
        next(err);
    }
};