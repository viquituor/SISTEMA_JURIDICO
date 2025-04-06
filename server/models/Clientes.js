const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Cliente {

    static async buscarTodos() {
        const [results] = await pool.query("SELECT * FROM cliente");
        return results;
    }
}

module.exports = Cliente;