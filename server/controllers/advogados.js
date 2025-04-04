const Advogado = require('../models/Advogado');

exports.listarAdvogados = async (req, res, next) => {
    try {
        const advogados = await Advogado.buscarTodos();
        res.json(advogados);
    } catch (err) {
        next(err);
    }
};

exports.buscarAdvogado = async (req, res, next) => {
    try {
        const advogado = await Advogado.buscarPorOAB(req.params.oab);
        if (!advogado) {
            return res.status(404).json({ error: "Advogado não encontrado" });
        }
        res.json(advogado);
    } catch (err) {
        next(err);
    }
};

exports.criarAdvogado = async (req, res, next) => {
    try {
        // Validação
        if (!req.body.oab || !req.body.nome || !req.body.email) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (!req.body.oab.match(/^\d{6}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "OAB deve conter 6 números" 
            });
        }

        const result = await Advogado.criar(req.body);
        
        res.status(201).json({
            success: true,
            id: result.id,
            message: "Advogado cadastrado com sucesso!"
        });
        
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: "OAB já cadastrada no sistema"
            });
        }
        next(err);
    }
};

exports.atualizarAdvogado = async (req, res, next) => {
    try {
        // Validação
        if (req.body.oab && !req.body.oab.match(/^\d{6}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "OAB deve conter 6 números" 
            });
        }

        const result = await Advogado.atualizar(req.params.oab, req.body);
        
        res.json({ 
            success: true, 
            message: "Advogado atualizado com sucesso!",
            novaOAB: result.novaOAB
        });
        
    } catch (err) {
        next(err);
    }
};

exports.deletarAdvogado = async (req, res, next) => {
    try {
        const result = await Advogado.deletar(req.params.oab);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: "Advogado não encontrado"
            });
        }

        res.json({
            success: true,
            message: "Advogado excluído com sucesso"
        });

    } catch (err) {
        if (err.message.includes("contratos associados")) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        next(err);
    }
};