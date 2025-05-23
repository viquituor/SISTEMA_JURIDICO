const pool = require('../config/database');

class PrazoPro {
    
    static async buscarPrazos(num_processo) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT * FROM prazo_de_processo
                WHERE num_processo = ?
                ORDER BY data_prapro DESC
            `, [num_processo]);
            return results;
        } finally {
            connection.release();
        }
    };

    static async criarPrazo(num_processo, descritao_prapro, data_prapro, nome_prapro, status_prapro) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                INSERT INTO prazo_de_processo 
                (num_processo, descritao_prapro, data_prapro, nome_prapro, status_prapro) 
                VALUES (?, ?, ?, ?, ?)
            `, [num_processo, descritao_prapro, data_prapro, nome_prapro, status_prapro]);
            return results.insertId;
        } catch (error) {
            console.error("Erro ao criar prazo:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async deletarPrazo(cod_prapro) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                DELETE FROM prazo_de_processo 
                WHERE cod_prapro = ?
            `, [cod_prapro]);
            if (results.affectedRows === 0) {
                throw new Error("Nenhum prazo encontrado com o código fornecido.");
            }
            return results.affectedRows;
        } catch (error) {
            console.error("Erro ao deletar prazo:", error);
            throw error;
        } finally {
            connection.release();
        }
    };

    static async editarPrazo(cod_prapro, descritao_prapro, data_prapro, nome_prapro, status_prapro) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                UPDATE prazo_de_processo SET
                    descritao_prapro = ?,
                    data_prapro = ?,
                    nome_prapro = ?,
                    status_prapro = ?
                WHERE cod_prapro = ?
            `, [
                descritao_prapro,
                new Date(data_prapro),
                nome_prapro,
                status_prapro,
                cod_prapro
            ]);
            
            return results;
        } finally {
            connection.release();
        }
    }
}

module.exports = PrazoPro;