const pool = require('../config/database');

class Pagamentos {

    static async buscarContratos(oab) {
        const connection = await pool.getConnection();
        try {
            
            const [results] = await pool.query(`
                
                SELECT 
                    c.cod_contrato AS cod_cont,   
                    cli.nome AS nome_cliente, 
                    c.tipo_servico, 
                    c.status_contrato, 
                    p.*,
                    c.valor, 
                    COALESCE(SUM(p.valorPago), 0) AS valor_pago, 
                    (c.valor - COALESCE(SUM(p.valorPago), 0)) AS faltante 
                FROM contrato c
                LEFT JOIN pagamento p ON c.cod_contrato = p.cod_contrato
                JOIN cliente cli ON c.CPF = cli.CPF
                WHERE c.OAB = ?
                GROUP BY c.cod_contrato;
            `, [oab]);
            
            return results;
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            throw error;
        }
    };

    static async listarPagamentos(cod_contrato) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT * FROM pagamento 
                WHERE cod_contrato = ?
                GROUP BY cod_pag;
            `, [cod_contrato]);
            return results;
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async criarPagamento(pagamento) {
        const connection = await pool.getConnection();
        try {
            const { cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago } = pagamento;
            const [result] = await connection.query(`
                INSERT INTO pagamento (cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago) 
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, [cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago]);
            return result;
        } catch (error) {
            console.error("Erro ao criar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async deletarPagamento(cod_pagamento) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                DELETE FROM pagamento 
                WHERE cod_pag = ?;
            `, [cod_pagamento]);
            return result;
        } catch (error) {
            console.error("Erro ao deletar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async atualizarPagamento(cod_pagamento, pagamento) {
        const connection = await pool.getConnection();
        try {
            const { cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago } = pagamento;
            const [result] = await connection.query(`
                UPDATE pagamento 
                SET cod_contrato = ?, data_pag = ?, data_vencimento = ?, descricao = ?, status_pag = ?, metodo = ?, valorPago = ? 
                WHERE cod_pag = ?;
            `, [cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago, cod_pagamento]);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

}

module.exports = Pagamentos;