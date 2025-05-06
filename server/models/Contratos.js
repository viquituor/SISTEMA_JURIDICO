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

    static async buscarListas(cod_contrato) {
        try {
            const [results] = await pool.query(`
                SELECT * FROM contrato ct
                JOIN documento d on d.cod_contrato = ct.cod_contrato
                JOIN agenda a on a.cod_contrato = ct.cod_contrato
                JOIN pagamento p on p.cod_contrato = ct.cod_contrato
                WHERE ct.cod_contrato = ?

            `, [cod_contrato]);
            
            console.log("Resultados da query:", results);
            return results

        } catch (error) {
            console.error("Erro ao buscar contratos:", error);
            throw error;
        }
    }

    static async criarContrato(contrato) {
        try {
            const [result] = await pool.query(`
                INSERT INTO contrato 
                (OAB, CPF, data_inicio, tipo_servico, status_contrato, descricao, valor) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                contrato.OAB, 
                contrato.CPF, 
                contrato.data_inicio, 
                contrato.tipo_servico, 
                contrato.status_contrato, 
                contrato.descricao, 
                contrato.valor
            ]);
            
            return result;
    
        } catch (error) {
            console.error("Erro ao criar contrato:", error);
            throw error;
        }
    }
    
    static async deletarContrato(cod_contrato) {    
        try {
            const [result] = await pool.query(`
                DELETE FROM contrato 
                WHERE cod_contrato = ?
            `, [cod_contrato]);
            
            return result;
    
        } catch (error) {
            console.error("Erro ao deletar contrato:", error);
            throw error;
        }
    }

    static async atualizarContrato(cod_contrato, contrato) {
        try {
            const [result] = await pool.query(`
                UPDATE contrato 
                SET OAB = ?, CPF = ?, data_inicio = ?, tipo_servico = ?, status_contrato = ?, descricao = ?, valor = ? 
                WHERE cod_contrato = ?
            `, [
                contrato.OAB, 
                contrato.CPF, 
                contrato.data_inicio, 
                contrato.tipo_servico, 
                contrato.status_contrato, 
                contrato.descricao, 
                contrato.valor,
                cod_contrato
            ]);
            
            return result;
    
        } catch (error) {
            console.error("Erro ao atualizar contrato:", error);
            throw error;
        }
    }

}

module.exports = Contratos;