const Cliente = require('../models/Clientes');

exports.listarClientes = async (req, res, next) => {
    try {
        const clientes = await Cliente.buscarTodos();
        res.json(clientes);
    } catch (err) {
        console.error("Erro no controller de clientes:", err);
        next(err);
    }
};

exports.deletarCliente = async (req, res, next) => {
    try {
        const result = await Cliente.deletarCliente(req.params.cpf);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: "cliente não encontrado"
            });
        }

        res.json({
            success: true,
            message: "cliente excluído com sucesso"
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

exports.criarCliente = async (req, res, next) => {
    try {
        // Validação
        if (!req.body.cpf || !req.body.nome || !req.body.email) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (!req.body.cpf.match(/^\d{11}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "CPF deve conter 11 números" 
            });
        }

        const result = await Cliente.criarCliente(req.body);
        
        res.status(201).json({
            success: true,
            id: result.id,
            message: "Cliente cadastrado com sucesso!"
        });
        
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: "CPF já cadastrada no sistema"
            });
        }
        next(err);
    }
};

exports.atualizarCliente = async (req, res, next) => {
    try {
        // Validação do CPF (se estiver sendo alterado)
        if (req.body.cpf && !req.body.cpf.match(/^\d{11}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "CPF deve conter 11 números" 
            });
        }

        const result = await Cliente.atualizarCliente(req.params.cpf, req.body);
        
        res.json({ 
            success: true, 
            message: "Cliente atualizado com sucesso!",
            novaCPF: result.novaCPF
        });
        
    } catch (err) {
        if (err.message.includes("obrigatório")) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              success: false,
              error: "Novo CPF já está cadastrado no sistema"
            });
        }
        next(err);
    }
};