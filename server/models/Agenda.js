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
                ORDER BY a.data_compromisso
            `, [oab]);
            return results;
        } finally {
            connection.release();
        }
    }

}

module.exports = Agenda;