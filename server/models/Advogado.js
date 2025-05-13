const pool = require('../config/database');

class Advogado {

    static async buscarTodos() {
        const [results] = await pool.query("SELECT * FROM advogado");
        return results;
    }

    static async buscarPorOAB(oab) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query("SELECT * FROM advogado WHERE OAB = ?", [oab]);
            const [telefones] = await connection.query("SELECT telefone FROM telefone_ADV WHERE OAB = ?", [oab]);
            return { 
                ...results[0], 
                telefone: telefones[0]?.telefone 
            };
        } finally {
            connection.release();
        }
    }

    static async criar(dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const { nome, email, oab, telefone, cidade, bairro, logradouro, uf, numero, cep } = dados;
            
            const [result] = await connection.execute(
                `INSERT INTO advogado 
                (nome, email, OAB, cidade, bairro, logradouro, UF, numero, CEP) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nome, email, oab.toUpperCase(), cidade, bairro, logradouro, uf.toUpperCase(), numero, cep.toUpperCase()]
            );

            if(telefone) {
                await connection.execute(
                    'INSERT INTO telefone_ADV (telefone, OAB) VALUES (?, ?)',
                    [telefone, oab.toUpperCase()]
                );
            }

            await connection.commit();
            return { success: true, id: result.insertId };
            
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async atualizar(oabAntiga, dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const { nome, email, oab: novaOAB, telefone, cidade, bairro, logradouro, uf, numero, cep } = dados;

            // Atualiza os dados do advogado
            await connection.query(
                `UPDATE advogado SET 
                    nome = ?, email = ?, OAB = ?, cidade = ?, bairro = ?, 
                    logradouro = ?, UF = ?, numero = ?, CEP = ?
                    WHERE OAB = ?`,
                [
                    nome, email, 
                    novaOAB || oabAntiga,
                    cidade, bairro, logradouro, 
                    uf.toUpperCase(), numero, cep,
                    oabAntiga
                ]
            );

            // Atualiza telefone
            if(telefone) {
                await connection.query(
                    'UPDATE telefone_ADV SET telefone = ? WHERE OAB = ?',
                    [telefone, novaOAB || oabAntiga]
                );
            }

            if(novaOAB){
                await connection.query(
                    'UPDATE telefone_ADV SET OAB = ? WHERE OAB = ?',
                    [novaOAB, oabAntiga]
                );
            }

            await connection.commit();
            return { success: true, novaOAB: novaOAB || oabAntiga };
            
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async deletar(oab) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [contratos] = await connection.execute(
                `SELECT COUNT(*) AS total FROM contrato WHERE OAB = ?`,
                [oab]
            );

            if (contratos[0].total > 0) {
                throw new Error("Não é possível excluir: advogado possui contratos associados");
            }

            await connection.execute(
                'DELETE FROM telefone_ADV WHERE OAB = ?',
                [oab]
            );

            const [result] = await connection.execute(
                'DELETE FROM advogado WHERE OAB = ?',
                [oab]
            );

            await connection.commit();
            return { success: result.affectedRows > 0 };
            
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = Advogado;