const Processos = require('../models/Processos');

exports.buscarProcessos = async(req, res, next) => {
try {
        const response = await Processos.listarProcessos(req.params.oab);
        res.json(response);
    } catch (err) {
        next(err);
    }
}

exports.listarPrazo = async(req, res, next) => {
    try {
        const response = await Processos.listarPrazoProcessso(req.params.num_processo);
        res.json(response);
    } catch (error) {
        next(error);
        
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

exports.deleteProcesso = async(req, res, next) => {
    try {
        const response = await Processos.excluirProcesso(req.params.num_processo);
        res.json(response);
    } catch (error) {
        next(Error);
    }
}

exports.editarProcesso = async(req,res,next) => {
    try {
        const response = await Processos.editarProcesso(
            req.params.num_processo, // Adiciona o num_processo da URL
            req.body
        );
        res.json({
            success: true,
            message: "Processo atualizado com sucesso",
            data: response
        });
    } catch (error) {
        next(error); // Passa o error real, não o construtor Error
    }
}