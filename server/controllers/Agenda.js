const Agenda = require('../models/Agenda');

exports.criarCompromisso = async (req, res, next) => {
    try {
        const { oab } = req.params;
        
        // Verifica se o advogado existe
        const [advogado] = await pool.query(
            "SELECT 1 FROM advogado WHERE OAB = ?",
            [oab]
        );
        
        if (advogado.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Advogado não encontrado"
            });
        }

        const result = await Agenda.criar(req.body);
        
        res.status(201).json({
            success: true,
            cod_compromisso: result.cod_compromisso,
            message: "Compromisso cadastrado com sucesso!"
        });
    } catch (err) {
        if (err.message.includes("Contrato não encontrado")) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        next(err);
    }
};

exports.buscarCompromissos = async (req, res, next) => {
    try {
        const { oab } = req.params;
        
        // Verifica se o advogado existe
        const [advogado] = await pool.query(
            "SELECT 1 FROM advogado WHERE OAB = ?",
            [oab]
        );
        
        if (advogado.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Advogado não encontrado"
            });
        }

        const compromissos = await Agenda.buscarCompromissosPorAdvogado(oab);
        res.json(compromissos);
    } catch (err) {
        next(err);
    }
};

exports.buscarCompromissosPorContrato = async (req, res, next) => {
    try {
        const { cod_contrato } = req.params;
        const compromissos = await Agenda.buscarCompromissosPorContrato(cod_contrato);
        res.json(compromissos);
    } catch (err) {
        next(err);
    }
};

exports.buscarContratosDisponiveis = async (req, res, next) => {
    try {
        const { oab } = req.params;
        const contratos = await Agenda.buscarContratosPorAdvogado(oab);
        res.json(contratos);
    } catch (err) {
        next(err);
    }
};

exports.atualizarCompromisso = async (req, res, next) => {
    try {
        const { cod_compromisso } = req.params;
        const result = await Agenda.atualizar(cod_compromisso, req.body);
        
        res.json({ 
            success: true, 
            message: "Compromisso atualizado com sucesso!"
        });
    } catch (err) {
        if (err.message.includes("Contrato não encontrado")) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        next(err);
    }
};

exports.deletarCompromisso = async (req, res, next) => {
    try {
        const { cod_compromisso } = req.params;
        const result = await Agenda.deletar(cod_compromisso);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: "Compromisso não encontrado"
            });
        }

        res.json({
            success: true,
            message: "Compromisso excluído com sucesso"
        });
    } catch (err) {
        next(err);
    }
};