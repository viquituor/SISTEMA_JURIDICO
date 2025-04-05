const pool = require('../config/database');

class Agenda {
    
    static async buscarCompromissosPorAdvogado(oab) {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT 
                    a.cod_compromisso,
                    a.cod_contrato,
                    a.data_compromisso,
                    a.nome_compromisso,
                    a.descricao,
                    a.status_compromisso,
                    c.descricao AS descricao_contrato,
                    cli.nome AS nome_cliente
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

    static async buscarCompromissosPorContrato(cod_contrato) {
        const [results] = await pool.query(
            "SELECT * FROM agenda WHERE cod_contrato = ? ORDER BY data_compromisso",
            [cod_contrato]
        );
        return results;
    }

    static async buscarPorId(cod_compromisso) {
        const [results] = await pool.query(
            "SELECT * FROM agenda WHERE cod_compromisso = ?",
            [cod_compromisso]
        );
        return results[0];
    }

    static async criar(dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            // Verifica se o contrato existe (se foi fornecido)
            if (dados.cod_contrato) {
                const [contrato] = await connection.query(
                    "SELECT 1 FROM contrato WHERE cod_contrato = ?",
                    [dados.cod_contrato]
                );
    
                if (contrato.length === 0) {
                    throw new Error("Contrato não encontrado");
                }
            }
    
            // Valida o status do compromisso
            const statusValidos = ['agendado', 'confirmado', 'cancelado', 'concluido'];
            if (!statusValidos.includes(dados.status_compromisso)) {
                dados.status_compromisso = 'agendado'; // Valor padrão
            }
    
            const [result] = await connection.execute(
                `INSERT INTO agenda 
                (cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    dados.cod_contrato || null,
                    new Date(dados.data_compromisso).toISOString().slice(0, 19).replace('T', ' '),
                    dados.nome_compromisso,
                    dados.descricao,
                    dados.status_compromisso
                ]
            );
    
            await connection.commit();
            return { 
                success: true, 
                id: result.insertId,
                cod_compromisso: result.insertId
            };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async atualizar(cod_compromisso, dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            if (dados.cod_contrato) {
                const [contrato] = await connection.query(
                    "SELECT 1 FROM contrato WHERE cod_contrato = ?",
                    [dados.cod_contrato]
                );

                if (contrato.length === 0) {
                    throw new Error("Contrato não encontrado");
                }
            }

            await connection.query(
                `UPDATE agenda SET 
                    cod_contrato = ?, 
                    data_compromisso = ?, 
                    nome_compromisso = ?, 
                    descricao = ?, 
                    status_compromisso = ?
                WHERE cod_compromisso = ?`,
                [
                    dados.cod_contrato,
                    dados.data_compromisso,
                    dados.nome_compromisso,
                    dados.descricao,
                    dados.status_compromisso,
                    cod_compromisso
                ]
            );

            await connection.commit();
            return { success: true };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async deletar(cod_compromisso) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                "DELETE FROM agenda WHERE cod_compromisso = ?",
                [cod_compromisso]
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

    static async buscarContratosPorAdvogado(oab) {
        const [results] = await pool.query(
            "SELECT cod_contrato, descricao FROM contrato WHERE OAB = ?",
            [oab]
        );
        return results;
    }
}

module.exports = Agenda;