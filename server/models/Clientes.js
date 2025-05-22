const pool = require('../config/database');


class Cliente {


    static async buscarTodos() {
        try {
            const [results] = await pool.query(`
                SELECT c.*, GROUP_CONCAT(t.telefone) AS telefones 
                FROM cliente c
                LEFT JOIN telefone_cli t ON c.CPF = t.CPF
                GROUP BY c.CPF
            `);
            
            // Formata os telefones como array
            return results.map(cliente => ({
                ...cliente,
                telefones: cliente.telefones ? cliente.telefones.split(',') : []
            }));
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            throw error;
        }
    }


     static async deletarCliente(cpf) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [contratos] = await connection.execute(
            `SELECT COUNT(*) AS total FROM contrato WHERE CPF = ?`,
            [cpf]
        );

        if (contratos[0].total > 0) {
            throw new Error("Não é possível excluir: cliente possui contratos associados");
        }

        await connection.execute(
            'DELETE FROM telefone_cli WHERE CPF = ?',
            [cpf]
        );

        const [result] = await connection.execute(
            'DELETE FROM cliente WHERE CPF = ?',
            [cpf]
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

    static async criarCliente(dados) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { nome, email, cpf, telefone, cidade, bairro, logradouro, uf, numero, cep } = dados;
        
        const [result] = await connection.execute(
            `INSERT INTO cliente 
            (nome, email, CPF, cidade, bairro, logradouro, UF, numero, CEP) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, email, cpf.toUpperCase(), cidade, bairro, logradouro, uf.toUpperCase(), numero, cep.toUpperCase()]
        );

        if(telefone) {
            await connection.execute(
                'INSERT INTO telefone_cli (telefone, CPF) VALUES (?, ?)',
                [telefone, cpf.toUpperCase()]
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

    static async atualizarCliente(CPFAntiga, dados) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Validação de campos obrigatórios
            const camposObrigatorios = ['nome', 'email', 'cpf', 'telefone', 'cidade', 'bairro', 'logradouro', 'uf', 'numero', 'cep'];
            for (const campo of camposObrigatorios) {
                if (!dados[campo]) {
                    throw new Error(`O campo ${campo} é obrigatório`);
                }
            }
    
            // Extrai os dados (todos obrigatórios)
            const { 
                nome, 
                email, 
                cpf: novaCPF, 
                telefone, 
                cidade, 
                bairro, 
                logradouro, 
                uf, 
                numero, 
                cep 
            } = dados;
        
            // Validação do formato do CPF
            if (!novaCPF.match(/^\d{11}$/)) {
                throw new Error("CPF deve conter exatamente 11 dígitos numéricos");
            }
    
            // Validação do formato do CEP (exemplo: 8 dígitos)
            if (!cep.match(/^\d{8}$/)) {
                throw new Error("CEP deve conter exatamente 8 dígitos numéricos");
            }
    
            // Validação do formato da UF (exatamente 2 caracteres)
            if (!uf.match(/^[A-Z]{2}$/)) {
                throw new Error("UF deve conter exatamente 2 letras maiúsculas");
            }
    
            // Atualiza os dados do cliente
            await connection.query(
                `UPDATE cliente SET 
                    nome = ?, email = ?, CPF = ?, cidade = ?, bairro = ?, 
                    logradouro = ?, UF = ?, numero = ?, CEP = ?
                    WHERE CPF = ?`,
                [
                    nome, 
                    email, 
                    novaCPF, // Já validado acima
                    cidade, 
                    bairro, 
                    logradouro, 
                    uf.toUpperCase(), // Garantindo maiúsculas
                    numero, 
                    cep, // Já validado acima
                    CPFAntiga
                ]
            );
        
            // Atualiza telefone - primeiro remove todos os existentes
            await connection.query(
                'DELETE FROM telefone_cli WHERE CPF = ?',
                [novaCPF]
            );
            
            // Insere o novo telefone (obrigatório)
            await connection.query(
                'INSERT INTO telefone_cli (telefone, CPF) VALUES (?, ?)',
                [telefone, novaCPF]
            );
        
            await connection.commit();
            return { success: true, novaCPF: novaCPF };
            
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }


}

module.exports = Cliente;