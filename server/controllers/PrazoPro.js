
const PrazoPro = require('../models/PrazoPro');

exports.getAllPrazos = async (req, res) => {
    try {
        const prazos = await PrazoPro.getAll();
        res.json(prazos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPrazosByProcesso = async (req, res) => {
    try {
        const { num_processo } = req.params;
        const prazos = await PrazoPro.getByProcesso(num_processo);
        res.json(prazos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPrazo = async (req, res) => {
    try {
        const { num_processo, nome_prapro, data_prapro, descritao_prapro, status_prapro } = req.body;
        const id = await PrazoPro.create({ num_processo, nome_prapro, data_prapro, descritao_prapro, status_prapro });
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePrazo = async (req, res) => {
    try {
        const { cod_prapro } = req.params;
        const { nome_prapro, data_prapro, descritao_prapro, status_prapro } = req.body;
        const affectedRows = await PrazoPro.update(cod_prapro, { nome_prapro, data_prapro, descritao_prapro, status_prapro });
        
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Prazo não encontrado' });
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePrazo = async (req, res) => {
    try {
        const { cod_prapro } = req.params;
        const affectedRows = await PrazoPro.delete(cod_prapro);
        
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Prazo não encontrado' });
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};