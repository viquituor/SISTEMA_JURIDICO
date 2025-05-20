const pool = require('../config/database');

class Processos {

static async listarProcessos(oab){
    const connection = await pool.getConnection();
    try {
        const [results] = await pool.query(`
                        SELECT* FROM processo p
                        JOIN contrato c ON c.cod_contrato=p.cod_contrato
                        JOIN cliente cli ON cli.cpf = c.cpf
                        WHERE c.OAB = ?;
            `,[oab]);
return results;
    } catch (error) {
        alert('ERRO AO BUSCAR PROCESSOS', Error);
        throw Error;
    }
};

static async addProcesso(processo) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const { cod_contrato, num_processo,status_processo, descricao } = processo;
            
            const [result] = await connection.query(`
                INSERT INTO processo 
                (cod_contrato, num_processo, status_processo, descricao) 
                VALUES (?, ?, ?, ?);
            `, [cod_contrato, num_processo, status_processo, descricao]);
            
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            console.error('Erro no model ao adicionar processo:', error);
            throw error;
        } finally {
            connection.release();
        }
    };


}

module.exports = Processos;