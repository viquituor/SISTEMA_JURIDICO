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


}

module.exports = Processos;