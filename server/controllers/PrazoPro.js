const PrazoPro = require('../models/PrazoPro');

exports.buscarPrazos = async (req, res, next) => {
    try {
        const { num_processo } = req.params;
        const prazos = await PrazoPro.buscarPrazos(num_processo);
        res.json(prazos);
    } catch (err) {
        next(err);
    }
};

exports.criarPrazo = async (req, res, next) => {
    try {
        const { num_processo } = req.params;
        const { descritao_prapro, data_prapro, nome_prapro, status_prapro } = req.body;
        
        // Validação básica
        if (!descritao_prapro || !data_prapro || !nome_prapro) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const resultado = await PrazoPro.criarPrazo(
            num_processo,
            descritao_prapro,
            data_prapro,
            nome_prapro,
            status_prapro || 'pendente' // Valor padrão
        );
        
        res.status(201).json({ 
            success: true,
            id: resultado 
        });
    } catch (err) {
        next(err);
    }
};

exports.deletarPrazo = async (req, res, next) => {
    try {
        const { cod_prapro } = req.params;
        const resultado = await PrazoPro.deletarPrazo(cod_prapro);
        res.status(200).json({ 
            success: true,
            message: 'Prazo deletado com sucesso',
            affectedRows: resultado 
        });
    } catch (err) {
        next(err);
    }
};

exports.editarPrazo = async (req, res, next) => {
    try {
        const { cod_prapro } = req.params;
        const { 
            descritao_prapro, 
            data_prapro, 
            nome_prapro, 
            status_prapro 
        } = req.body;

        // Validação básica
        if (!descritao_prapro || !data_prapro || !nome_prapro) {
            return res.status(400).json({ 
                error: 'Descrição, data e nome do prazo são obrigatórios' 
            });
        }

        const resultado = await PrazoPro.editarPrazo(
            cod_prapro,
            descritao_prapro,
            data_prapro,
            nome_prapro,
            status_prapro
        );
        
        res.status(200).json({ 
            success: true,
            resultado 
        });
    } catch (err) {
        console.error("Erro no controller:", err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};