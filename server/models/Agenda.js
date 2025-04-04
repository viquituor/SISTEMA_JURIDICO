const pool = require('../config/database');

class Agenda {
    static async buscarCompromissos(oab) {
        const [results] = await pool.query(
            "SELECT * FROM agenda WHERE OAB = ? ORDER BY data_compromisso",
            [oab]
        );
        return results;
    }

    static async adicionarCompromisso(dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso, oab } = dados;

            const [result] = await connection.execute(
                `INSERT INTO agenda 
                (cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso, OAB) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso, oab]
            );

            await connection.commit();
            return { success: true, id: result.insertId };

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = Agenda;