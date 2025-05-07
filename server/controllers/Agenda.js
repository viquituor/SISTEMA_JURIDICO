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

exports.criarCompromisso = async (req, res, next) => {
    try {
        const { oab } = req.params;
        const { cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso } = req.body;
        
        // Validação básica
        if (!cod_contrato || !data_compromisso || !nome_compromisso) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const resultado = await Agenda.criarCompromisso(
            cod_contrato,
            data_compromisso,
            nome_compromisso,
            descricao,
            status_compromisso || 'marcado' // Valor padrão
        );
        
        res.status(201).json({ 
            success: true,
            id: resultado 
        });
    } catch (err) {
        next(err);
    }
};

exports.deletarCompromisso = async (req, res, next) => {
    try {
        const { cod_compromisso } = req.params;
        const resultado = await Agenda.deletarCompromisso(cod_compromisso);
        res.status(200).json({ 
            success: true,
            message: 'Compromisso deletado com sucesso',
            affectedRows: resultado 
        });
    } catch (err) {
        next(err);
    }
};