const pool = require('../config/database');

class Contratos {
    static async buscarTodos(oab) {
        try {
            const [results] = await pool.query(`
                SELECT c.*, cli.nome AS nome_cliente, adv.nome AS nome_advogado FROM contrato c
                JOIN cliente cli ON c.CPF = cli.CPF
                JOIN advogado adv ON c.OAB = adv.OAB
                WHERE c.OAB = ?
            `, [oab]);
            
            console.log("Resultados da query:", results);
            return results

        } catch (error) {
            console.error("Erro ao buscar contratos:", error);
            throw error;
        }
    }

    static async buscarCompromissos(cod_contrato) {
        try {
            const [results] = await pool.query(`
                SELECT * FROM agenda 
                WHERE cod_contrato = ?
            `, [cod_contrato]);
            
            console.log("Resultados da query:", results);
            return results

        } catch (error) {
            console.error("Erro ao buscar contratos:", error);
            throw error;
        }
    }
    
}

module.exports = Contratos;