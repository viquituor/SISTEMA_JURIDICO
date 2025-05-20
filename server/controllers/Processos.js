const Processos = require('../models/Processos');

exports.buscarProcessos = async(req, res, next) => {
try {
        const response = await Processos.listarProcessos(req.params.oab);
        res.json(response);
    } catch (err) {
        next(err);
    }
}

exports.addProcesso = async(req, res, next) => {
    try {
        const response = await Processos.addProcesso(req.body);
        
        res.status(201).json({
            success: true,
            message: "Processo adicionado com sucesso",
            data: {
                id_processo: response.insertId,
                ...req.body
            }
        });
    } catch (error) {
        console.error('Erro no controller ao adicionar processo:', error);
        next({
            status: 500,
            message: 'Falha ao adicionar processo',
            error: error.message
        });
    }
}