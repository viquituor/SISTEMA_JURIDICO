



use certificados10k;

-- 1 Mostrar a Engine das tabelas
SELECT TABLE_NAME, ENGINE 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'Certificados10k';

-- 2 Mostrar os índices das tabelas participante e evento

SHOW INDEX FROM participante;
SHOW INDEX FROM evento;

-- 3 Criar índices secundários

-- Índice para nome_completo na tabela participante
CREATE INDEX idx_nome_completo ON participante(nome_completo);

-- Índice para ano na tabela evento
CREATE INDEX idx_ano ON evento(ano);

-- 4 Comparação de desempenho com e sem índice (consultas pontuais)

-- Com índice primário (rápido)
explain SELECT * FROM participante WHERE id = 751;

-- Sem índice secundário (lento)
explain SELECT * FROM participante ignore index(idx_nome_completo) WHERE nome_completo = 'Aaron Gomes Owen';

-- Com índice secundário (rápido)
explain SELECT * FROM participante WHERE nome_completo = 'Aaron Gomes Owen';



-- 5 Desempenho de consulta com junção

-- Sem índice

EXPLAIN
SELECT a.titulo, a.carga_horaria, p.nome_completo, e.sigla, e.ano
FROM atividade a
JOIN participacao pc ON a.id = pc.atividade_id
JOIN participante p ignore index(idx_nome_completo) ON pc.participante_id = p.id
JOIN evento e ON a.evento_id = e.id
WHERE p.nome_completo = 'Aaron Gomes Owen';

-- com índice

EXPLAIN
SELECT a.titulo, a.carga_horaria, p.nome_completo, e.sigla, e.ano
FROM atividade a
JOIN participacao pc ON a.id = pc.atividade_id
JOIN participante p ON pc.participante_id = p.id
JOIN evento e ON a.evento_id = e.id
WHERE p.nome_completo = 'Aaron Gomes Owen';


-- 6 Desempenho de subconsulta

-- Sem índice

EXPLAIN
SELECT titulo, carga_horaria 
FROM atividade 
WHERE evento_id IN (
    SELECT evento_id FROM participacao 
    WHERE participante_id IN (
        SELECT id FROM participante IGNORE INDEX(idx_nome_completo)
        WHERE nome_completo = 'Aaron Gomes Owen'
    )
);

-- com índice

EXPLAIN
SELECT titulo, carga_horaria 
FROM atividade 
WHERE evento_id IN (
    SELECT evento_id FROM participacao 
    WHERE participante_id IN (
        SELECT id FROM participante 
        WHERE nome_completo = 'Aaron Gomes Owen'
    )
);


-- 7 Subconsulta com junção

-- Sem índice

EXPLAIN
SELECT a.titulo, a.carga_horaria, e.nome, e.sigla, e.ano
FROM atividade a
JOIN evento e ON a.evento_id = e.id
WHERE a.evento_id IN (
    SELECT evento_id FROM participacao 
    WHERE participante_id IN (
        SELECT id FROM participante IGNORE INDEX(idx_nome_completo)
        WHERE nome_completo = 'Ana Santos'
    )
);

-- com índice

EXPLAIN
SELECT a.titulo, a.carga_horaria, e.nome, e.sigla, e.ano
FROM atividade a
JOIN evento e ON a.evento_id = e.id
WHERE a.evento_id IN (
    SELECT evento_id FROM participacao 
    WHERE participante_id IN (
        SELECT id FROM participante 
        WHERE nome_completo = 'Ana Santos'
    )
);


-- 8 Consulta com faixa de valores

-- Sem índice (forçado)

EXPLAIN SELECT * FROM evento IGNORE INDEX(idx_ano) 
WHERE ano BETWEEN 2010 AND 2015;

-- Com índice

EXPLAIN SELECT * FROM evento 
WHERE ano BETWEEN 2010 AND 2015;

-- Quando o otimizador não usa o índice

EXPLAIN SELECT * FROM evento 
WHERE ano BETWEEN 2000 AND 2023;


-- 9 Consulta com agrupamento

-- Sem índice (forçado)

EXPLAIN
SELECT ano, COUNT(*) as total_eventos
FROM evento IGNORE INDEX(idx_ano)
GROUP BY ano;

-- Com índice

EXPLAIN
SELECT ano, COUNT(*) as total_eventos
FROM evento
GROUP BY ano;

-- Usando índice primário

EXPLAIN
SELECT id, COUNT(*) as total_por_id
FROM participante
GROUP BY id;


-- 10 Excluir índices secundários

DROP INDEX idx_nome_completo ON participante;
DROP INDEX idx_ano ON evento;


