const pool = require('../config/database');

class Processos {

    static async listarProcessos(oab){
    const connection = await pool.getConnection();
    try {
        const [results] = await pool.query(`
                        SELECT c.descricao AS des_cont, c.*,  p.* , cli.* FROM processo p
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

    static async listarPrazoProcessso(num_processo){
        const connection = await pool.getConnection();
        try {
            const [results] = await pool.query(`
                SELECT * FROM prazo_de_processo 
                WHERE num_processo = ?
                ORDER BY data_prapro ASC
                LIMIT 10;
                `, [num_processo]);
                return results;
        } catch (error) {
            alert('erro ao buscar prazos de processo', Error);
            throw Error;
        }finally {
        connection.release();
    }};

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

    static async excluirProcesso(num_processo){
        const connection = await pool.getConnection();
        try {
            const [results] = await pool.query(`
                DELETE FROM processo 
                WHERE num_processo = ?
                `,[num_processo]);
                
        return results;
        } catch (error) {
            alert('erro no models ao excluir processo', Error);
            throw Error;
        }
    };

    static async editarProcesso(num_processo, processo) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { cod_contrato, status_processo, descricao } = processo;
        
        const [results] = await connection.query(`
            UPDATE processo SET 
                cod_contrato = ?, 
                status_processo = ?, 
                descricao = ?
            WHERE num_processo = ?
        `, [cod_contrato, status_processo, descricao, num_processo]);
        
        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao editar processo:', error);
        throw error;
    } finally {
        connection.release();
    }
    };


}

module.exports = Processos;