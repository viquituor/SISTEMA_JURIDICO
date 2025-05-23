const pool = require('../config/database');

class Pagamentos {

    static async buscarContratos(oab) {
    const connection = await pool.getConnection();
    try {
        // Primeiro busca os contratos
        const [contratos] = await connection.query(`
            SELECT 
                c.cod_contrato AS cod_cont,
                cli.nome AS nome_cliente,
                c.tipo_servico,
                c.status_contrato,
                c.valor,
                cli.CPF
            FROM contrato c
            JOIN cliente cli ON c.CPF = cli.CPF
            WHERE c.OAB = ?
            ORDER BY c.cod_contrato;
        `, [oab]);

        // Depois busca os totais de pagamento para cada contrato
        for (const contrato of contratos) {
            const [pagamentos] = await connection.query(`
                SELECT 
                    SUM(valorPago) AS total_pago
                FROM pagamento
                WHERE cod_contrato = ?;
            `, [contrato.cod_cont]);
            
            // Calcula os valores totais
            contrato.valor_pago = pagamentos[0].total_pago || 0;
            contrato.faltante = contrato.valor - contrato.valor_pago;
            
            // Busca o status mais recente do pagamento
            const [status] = await connection.query(`
                SELECT status_pag 
                FROM pagamento 
                WHERE cod_contrato = ?
                ORDER BY data_pag DESC
                LIMIT 1;
            `, [contrato.cod_cont]);
            
            contrato.status_pag = status.length > 0 ? status[0].status_pag : 'sem pagamento';
        }

        return contratos;
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        throw error;
    } finally {
        connection.release();
    }
}

    static async listarPagamentos(cod_cont) {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(`
            SELECT  p.*
            FROM pagamento p
            WHERE cod_contrato = ?
            ORDER BY cod_pag;
        `, [cod_cont]);
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
            await connection.beginTransaction();
            const { cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago } = pagamento;
            const [result] = await connection.query(`
                INSERT INTO pagamento (cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago) 
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, [cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago]);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao criar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async deletarPagamento(cod_pagamento) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(`
                DELETE FROM pagamento 
                WHERE cod_pag = ?;
            `, [cod_pagamento]);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao deletar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async atualizarPagamento(cod_pagamento, pagamento) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const { cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago } = pagamento;
            const [result] = await connection.query(`
                UPDATE pagamento 
                SET cod_contrato = ?, data_pag = ?, data_vencimento = ?, descricao = ?, status_pag = ?, metodo = ?, valorPago = ? 
                WHERE cod_pag = ?;
            `, [cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago, cod_pagamento]);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao atualizar pagamento:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

}

module.exports = Pagamentos;