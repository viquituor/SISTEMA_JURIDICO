const Contratos = require('../models/Contratos');
const pool = require('../config/database');
const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');

exports.listarContratosPorOAB = async (req, res, next) => {
    try {
        const contratos = await Contratos.buscarTodos(req.params.oab);
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

exports.addArquivos = [
  upload.single('documento'),
  async (req, res, next) => {
    try {
      const { cod_contrato } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Cria o objeto com os dados do documento
      const documento = {
        cod_contrato: cod_contrato,
        nome: req.file.originalname,
        link: `/uploads/contrato_${cod_contrato}/${req.file.filename}`
      };

      // Salva no banco de dados
      const result = await Contratos.addArquivo(documento);

      res.status(201).json({
        success: true,
        documento: {
          cod_doc: result.insertId,
          ...documento
        }
      });
    } catch (error) {
      // Remove o arquivo se houve erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  }
];

exports.downloadDocumento = async (req, res, next) => {
  try {
    const { cod_doc } = req.params;
    
    // Busca o documento no banco de dados
    const [rows] = await pool.query(
      'SELECT nome, link FROM documento WHERE cod_doc = ?',
      [cod_doc]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const documento = rows[0];
    const filePath = path.join(__dirname, '..', documento.link);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    // Configura os headers para download
    res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}"`);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

exports.excluirDocumento = async (req, res, next) => {
  try {
    const { cod_doc } = req.params;
    
    // Primeiro obtém o documento para pegar o caminho
    const [rows] = await pool.query(
      'SELECT link FROM documento WHERE cod_doc = ?',
      [cod_doc]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    
    const documento = rows[0];
    const filePath = path.join(__dirname, '..', documento.link);
    
    // Remove do banco de dados
    await pool.query('DELETE FROM documento WHERE cod_doc = ?', [cod_doc]);
    
    // Remove o arquivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: 'Documento excluído com sucesso' });
  } catch (error) {
    next(error);
  }
};