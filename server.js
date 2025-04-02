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

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // sua senha aqui
    database: 'BD_ADVOCACIA',
    // Remova o authPlugins se não for necessário
});

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


app.post("/advogados", async (req, res) => {
    console.log("Dados recebidos:", req.body); // Adicione esta linha
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const { nome, email, oab, telefone, cidade, bairro, logradouro, uf, numero, cep } = req.body;
        
        // Validação mais robusta
        if (!oab || !nome || !email) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (!oab.match(/^[A-Za-z]{2}\d{6}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "OAB deve conter 2 letras e 6 números (ex: SP123456)" 
            });
        }
        
        const [result] = await connection.execute(
            `INSERT INTO advogado 
            (nome, email, OAB, cidade, bairro, logradouro, UF, numero, CEP) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, email, oab.toUpperCase(), cidade, bairro, logradouro, uf.toUpperCase(), numero, cep.toUpperCase()]
            
        );


        if(telefone){
            await connection.execute(
                'INSERT INTO telefone_ADV (telefone, OAB) VALUES (?, ?)',[telefone,oab.toUpperCase()]
            )
        };

        await connection.commit();

        res.status(201).json({
            success: true,
            id: result.insertId,
            message: "Advogado cadastrado com sucesso!"
        });
        
    } catch (err) {
        await connection.rollback();
        console.error("Erro detalhado:", err);
        
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: "OAB já cadastrada no sistema"
            });
        }
        
        res.status(500).json({
            success: false,
            error: err.message || "Erro ao cadastrar advogado"
        });
    } finally {
        if (connection) connection.release();
    }
});


app.delete("/advogados/:oab", async (req, res) =>{
        let connection;
        try{
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const { oab } = req.params;

            // Verifica se o advogado tem contratos associados antes de deletar
                    const [contratos] = await connection.execute(
                            `SELECT COUNT(*) AS total FROM contrato WHERE OAB = ?`,[oab]
                    );

            if (contratos[0].total > 0) {
                    return res.status(400).json({
                        success: false,
                        error: "Não é possível excluir: advogado possui contratos associados"
                        });
                    }

            await connection.execute(
                'DELETE FROM telefone_ADV where OAB = ?',[oab]
            );

            const [result] = await connection.execute(
                'DELETE FROM advogado WHERE OAB = ?',[oab]
            );

            await connection.commit();

            if(result.affectedRows === 0){
                return res.status(404).json({
                    success: false,
                    error: "Advogado não encontrado"
                });
            }

            res.json({
                success:true,
                message:"Advogado excluido com sucesso"
            });


        }catch(err){
            await connection.rollback();
            console.error("Erro ao excluir Advogado:", err);

            res.status(500).json({
                success:false,
                error: err.message || "Erro ao excluir advogado"
            });
        }finally{
            if(connection) connection.release();
        }
} );


app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});