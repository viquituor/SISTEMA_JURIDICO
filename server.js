const express = require("express");
const mysql = require('mysql2/promise'); // Usando a versão promise-based
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão (sem conectar ainda)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // sua senha aqui
    database: 'BD_ADVOCACIA',
    // Remova o authPlugins se não for necessário
};

// Rota para obter advogados
app.get("/advogados", async (req, res) => {
    try {
        // Cria uma nova conexão para cada requisição
        const connection = await mysql.createConnection(dbConfig);
        
        // Executa a query
        const [results] = await connection.query("SELECT nome, oab FROM advogado");
        
        // Fecha a conexão
        await connection.end();
        
        // Retorna os resultados
        res.json(results);
    } catch (err) {
        console.error("Erro ao buscar advogados:", err);
        res.status(500).send(err);
    }
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});