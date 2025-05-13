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

exports.criarPagamento = async (req, res, next) => {
    try {
        const result = await Pagamentos.criarPagamento(req.body);
        res.status(201).json({
            success: true,
            message: "Pagamento criado com sucesso",
            cod_pagamento: result.insertId
        });
    } catch (err) {
        console.error("Erro ao criar pagamento:", err);
        next(err);
    }
}

exports.deletarPagamento = async (req, res, next) => {
    try {
        const result = await Pagamentos.deletarPagamento(req.params.cod_pagamento);
        
        if (result.affectedRows === 0) { // Verifica se alguma linha foi afetada
            return res.status(404).json({
                success: false,
                error: "Pagamento não encontrado"
            });
        }
    
        res.json({
            success: true,
            message: "Pagamento excluído com sucesso"
        });
    
    } catch (err) {
        console.error("Erro ao deletar pagamento:", err);
        next(err);
    }
}

exports.atualizarPagamento = async (req, res, next) => {
    try {
        const result = await Pagamentos.atualizarPagamento(req.params.cod_pagamento, req.body);
    
        if (result.affectedRows === 0) { // Verifica se alguma linha foi afetada
            return res.status(404).json({
                success: false,
                error: "Pagamento não encontrado"
            });
        }
        res.json({
            success: true,
            message: "Pagamento atualizado com sucesso"
        });
    } catch (error) {
        console.error("Erro ao atualizar pagamento:", error);
        res.status(500).json({
            success: false,
            error: "Erro interno do servidor"
        });
        
    }
}