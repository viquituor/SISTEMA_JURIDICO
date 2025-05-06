const Contratos = require('../models/Contratos');

exports.listarContratosPorOAB = async (req, res, next) => {
    try {
        const contratos = await Contratos.buscarTodos(req.params.oab);
        console.log("OAB recebida no back:", req.params.oab);
        res.json(contratos);
    } catch (err) {
        console.error("Erro no controller de contratos:", err);
        next(err);
    }
};

exports.listarPorContrato = async (req, res, next) => {
    try {
        const compromissos = await Contratos.buscarListas(req.params.cod_contrato);
        console.log("Código de contrato recebido no back:", req.params.cod_contrato);
        res.json(compromissos); // Corrigido para retornar a variável correta
    } catch (err) {
        console.error("Erro no controller de listar:", err);
        next(err);
    }
};

exports.criarContrato = async (req, res, next) => {
    try {
        // Validação completa
        const { OAB, CPF, data_inicio, tipo_servico, status_contrato, descricao, valor } = req.body;
        
        if (!OAB || !CPF || !data_inicio || !tipo_servico || !status_contrato || !valor) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (isNaN(valor) || valor <= 0) {
            return res.status(400).json({
                success: false,
                error: "Valor deve ser um número positivo"
            });
        }

        const result = await Contratos.criarContrato({
            OAB,
            CPF,
            data_inicio,
            tipo_servico,
            status_contrato,
            descricao: descricao || '',
            valor
        });
        
        res.status(201).json({
            success: true,
            message: "Contrato criado com sucesso",
            cod_contrato: result.insertId
        });

    } catch (err) {
        console.error("Erro ao criar contrato:", err);
        next(err);
    }
};

exports.deletarContrato = async (req, res, next) => {
    try {
        const result = await Contratos.deletarContrato(req.params.cod_contrato);
        
        if (result.affectedRows === 0) { // Verifica se alguma linha foi afetada
            return res.status(404).json({
                success: false,
                error: "Contrato não encontrado"
            });
        }

        res.json({
            success: true,
            message: "Contrato excluído com sucesso"
        });

    } catch (err) {
        console.error("Erro ao deletar contrato:", err);
        next(err);
    }
};

exports.atualizarContrato = async (req, res, next) => {
try {
    const result = await Contratos.atualizarContrato(req.params.cod_contrato, req.body);

    if (result.affectedRows === 0) { // Verifica se alguma linha foi afetada
        return res.status(404).json({
            success: false,
            error: "Contrato não encontrado"
        });
    }
    res.json({
        success: true,
        message: "Contrato atualizado com sucesso"
    });
} catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    res.status(500).json({
        success: false,
        error: "Erro interno do servidor"
    });
    
}
};
