
module.exports = PrazoPro;const pool = require('../config/database');

class PrazoPro {
    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT * FROM prazo_de_processo 
                ORDER BY data_prapro DESC
            `);
            return results;
        } finally {
            connection.release();
        }
    }

    static async getByProcesso(num_processo) {
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
    }

    static async create({ num_processo, nome_prapro, data_prapro, descritao_prapro, status_prapro }) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                INSERT INTO prazo_de_processo 
                (num_processo, nome_prapro, data_prapro, descritao_prapro, status_prapro) 
                VALUES (?, ?, ?, ?, ?)
            `, [num_processo, nome_prapro, data_prapro, descritao_prapro, status_prapro]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    static async update(cod_prapro, { nome_prapro, data_prapro, descritao_prapro, status_prapro }) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                UPDATE prazo_de_processo SET
                    nome_prapro = ?,
                    data_prapro = ?,
                    descritao_prapro = ?,
                    status_prapro = ?
                WHERE cod_prapro = ?
            `, [nome_prapro, data_prapro, descritao_prapro, status_prapro, cod_prapro]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    static async delete(cod_prapro) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                DELETE FROM prazo_de_processo 
                WHERE cod_prapro = ?
            `, [cod_prapro]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

module.exports = PrazoPro;