const pool = require('../config/database');

class Agenda {
    
    static async buscarCompromissos(oab) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT a.*, c.status_contrato, a.descricao, cli.nome AS nome_cliente, cli.CPF 
                FROM agenda a
                LEFT JOIN contrato c ON a.cod_contrato = c.cod_contrato
                LEFT JOIN cliente cli ON c.CPF = cli.CPF
                WHERE c.OAB = ?
                ORDER BY a.data_compromisso desc
            `, [oab]);
            return results;
        } finally {
            connection.release();
        }
    };

    static async criarCompromisso(cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                INSERT INTO agenda (cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso) 
                VALUES (?, ?, ?, ?, ?)
            `, [cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso]);
            return results.insertId; // Retorna o ID do novo registro
        } catch (error) {
            console.error("Erro ao criar compromisso:", error);
            throw error;
        } finally {
            connection.release(); // Libera a conexão
        }
    };

    static async deletarCompromisso(cod_compromisso) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                DELETE FROM agenda WHERE cod_compromisso = ?
            `, [cod_compromisso]);
            if (results.affectedRows === 0) {
                throw new Error("Nenhum compromisso encontrado com o codigo de compromisso fornecido.");
            }
            return results.affectedRows; // Retorna o número de linhas afetadas
        } catch (error) {
            console.error("Erro ao deletar compromisso:", error);
            throw error;
        } finally {
            connection.release(); // Libera a conexão
        }
    };

    static async editarCompromisso(cod_compromisso, data_compromisso, nome_compromisso, descricao, status_compromisso) {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(`
            UPDATE agenda SET
                data_compromisso = ?,
                nome_compromisso = ?,
                descricao = ?,
                status_compromisso = ?
            WHERE cod_compromisso = ?
        `, [
            new Date(data_compromisso),
            nome_compromisso,
            descricao,
            status_compromisso,
            cod_compromisso
        ]);
        
        return results;
    } finally {
        connection.release();
    }
}
}

module.exports = Agenda;