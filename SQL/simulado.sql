-- 1. O Hospital não permitirá a visualização, inserção, atualização ou exclusão diretamente nas tabelas
-- do banco de dados. Assim, as operações de escrita serão realizadas através de procedures, enquanto
-- que as consultas serão pré-estabelecidas através de visões. Sabendo disso, faça o que se pede:

-- a) Crie um usuário com o nome de "Recepcionista". Esse usuário deve possuir uma senha e apenas terá acesso
-- ao banco a partir da máquina local. Ele será o usuário utilizado nas transações iniciadas pela recepção do
-- hospital.
create user 'Recepcionista'@'localhost'
identified by '1234';



-- b) A recepção poderá consultar as consultas cadastradas, algumas informações dos pacientes e algumas
-- informações dos médicos. Essas informações serão necessárias para o registro de novas consultas e para a
-- confirmação de consultas já existentes. Portanto, crie a seguinte visão:
-- Deve-se exibir, em relação a cada paciente, o nome completo, o CPF, a data de nascimento, a cor, o
-- sexo, a quantidade de consultas aguardando atendimento, a quantidade de consultas que foram realizadas
-- e a quantidade de consultas que foram canceladas.
USE hospital;
CREATE VIEW consultasMarcadas AS
SELECT 
    pas.cpf_paciente,
    pas.nome_completo,
    pas.data_nascimento,
    pas.cor,
    pas.sexo,
    SUM(CASE WHEN con.status = 'Aguardando' THEN 1 ELSE 0 END) AS marcadas,
    SUM(CASE WHEN con.status = 'Realizada' THEN 1 ELSE 0 END) AS realizadas,
    SUM(CASE WHEN con.status = 'Cancelada' THEN 1 ELSE 0 END) AS canceladas
FROM 
    paciente pas
LEFT JOIN 
    consulta con ON pas.cpf_paciente = con.cpf_paciente
GROUP BY 
    pas.cpf_paciente, pas.nome_completo, pas.data_nascimento, pas.cor, pas.sexo;
    
    select * from consultasMarcadas;


-- c) Conceda, ao usuário "Recepcionista", o privilégio de CONSULTA na visão criada no Item b). Em seguida,
-- mostra os privilégios desse usuário.

grant select on consultasMarcadas to 'Recepcionista'@'localhost';
show grants for 'Recepcionista'@'localhost';



-- 2. O Hospital deseja melhorar o desempenho das consultas SQL com técnicas de tuning (otimização) a
-- fim de permitir que os usuários acessem as informações mais rápidas. Diante deste contexto,
-- responda:

-- a) Que técnica, estudada em BD-2, pode ser utilizada para aumentar o desempenho das consultas?

-- a técnica de indexação para melhorar a realização de consultas.

-- b) Dê um exemplo de otimização que possa ser feita a partir da necessidade do usuário "Recepcionista".

-- criando um index para consultas de tipo de exames asim tendo uma resposta mais rapida e consumindo menos memoria.

-- c) Implemente o código do Item b) e dê um exemplo do uso da técnica criada.

create index idxTiposExames on consulta(tipo_exame);
explain select * from consulta where tipo_exame = "Mapa";
explain select * from consulta ignore index (idxTiposExames) where tipo_exame = "Mapa";


-- 3. Responder as questões com as regras de negócio a fim de garantir as restrições de integridade:

-- a) Criar um gatilho (trigger), ao cadastrar um médico na tabela "Medico", a fim de efetuar duas verificações:
-- Se a hierarquia do médico for "Residente", deve-se cadastrar um novo registro na tabela "Residente"
-- com a data atual sendo a data de início da residência e a especialidade sendo "Clínica";
-- Se a hierarquia do médico for "Docente", deve-se cadastrar um novo registro na tabela "Docente" com
-- a titulação "Assistente", que é a titulação inicial do hospital.
-- Por fim, mostrar um exemplo de acionamento do gatilho para cada situação supracitada.

DELIMITER //
create trigger registrar_medico
after insert on medico
for each row
begin

		IF NEW.hierarquia = 'Residente' then
             insert into Residente (crm_residente, especialidade, data_inicio_residencia, data_fim_residencia)
             values (NEW.crm_medico, 'Clínica', curdate(), null);
             
             elseif New.hierarquia = 'Docente' then 
             insert into Docente (crm_docente, titulacao)
             values (NEW.crm_medico, 'Assistente');
             
             end if;
end //
DELIMITER;


-- b) Criar um procedimento (stored procedure) a fim de atualizar o status das consultas conforme as regras:
-- Se o status está "Aguardando" e a consulta não foi realizada após 24 horas da data prevista de realização,
-- o status da consulta deve ser alterado para "Cancelada";
-- Se o status está "Aguardando" e a consulta foi realizada até 24 horas da data prevista de realização, o
-- status da consulta deve ser alterado para "Realizada".
-- Por fim, mostrar como é feita a chamada do procedimento.

delimiter //
create procedure atualizar_status()
begin
update consulta
set status = 'Cancelado'
where status = 'Aguardando'
and data_hora_consulta_prevista < now() - interval 24 hour
and data_hora_consulta_realizada is null;

update consulta 
set status = 'Realizada'
where status = 'Aguardando'
and data_hora_consulta_realizada is not null 
and data_hora_consulta_realizada <= data_hora_consulta_prevista + interval 24 hour;
end //
delimiter ;

-- c) Criar uma função (function) que retorna a quantidade de consulta com status "Aguardando" de um paciente
-- para um específico tipo de exame, tendo o CPF do paciente e o tipo de exame como parâmetros.
-- Por fim, mostrar um exemplo de chamada da função.

DELIMITER //
CREATE FUNCTION contar_consultas_aguardando(
    p_cpf_paciente CHAR(11),
    p_tipo_exame ENUM('Ecocardiograma','Eletrocardiograma','Mapa','Holter')
) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE qtd INT;
    
    SELECT COUNT(*) INTO qtd
    FROM consulta
    WHERE cpf_paciente = p_cpf_paciente
    AND tipo_exame = p_tipo_exame
    AND status = 'Aguardando';
    
    RETURN qtd;
END //
DELIMITER ;

-- d) Um paciente pode agendar várias consultas para diferentes tipos de exame, exceto fazer um agendamento
-- para o mesmo tipo de exame que ainda esteja com status "Aguardando". Assim, é necessário criar um
-- gatilho (trigger) para atender essa regra de negócio. Então, o gatilho:
-- Não deve permitir a inserção de uma consulta com o mesmo tipo de exame se já existir uma, com status
-- "Aguardando", para o mesmo paciente;
-- Deve emitir uma mensagem de erro para o usuário, caso esta regra de negócio seja infringida.
-- Por fim, mostrar um exemplo de acionamento do gatilho.

delimiter //
create trigger antes_inserir_consulta
before insert on consulta
for each row
begin
	declare qtd_aguardando int;
    
    set qtd_aguardando = contar_consultas_aguardando(new.cpf_paciente, new.tipo_exame);
    
    if qtd_aguardando > 0 then signal sqlstate '45000'
    set message_text = 'ERRO: paciente ja possui uma consulta agendada para esse tipo de exame';
end if;
end //
delimiter ;

-- OBS: Utilizar a função criação no Item c) a fim de auxiliar na resolução desta questão.

-- 4. O Hospital terá uma alta quantidade de acessos simultâneos. Sendo assim, deseja-se que o SGBD
-- seja o mais performático possível. Todavia, por questões de segurança e integridade, não deve ser
-- permitido que dados que não foram efetivamente gravados na base de dados possam ser lidos por
-- alguma outra transação. Sendo assim, o problema da leitura suja não pode ocorrer. Tendo em vista
-- esse cenário, responda:

-- a) Qual é o nível de isolamento ideal para o SGBD nesse cenário?

-- nivel de read commited que não possibilita uma leitura suja
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- b) Demonstre o problema da leitura suja utilizando um nível de isolamento diferente do informado no Item a).

-- Sessão 1 (Transação que atualiza dados)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
UPDATE paciente SET nome_completo = 'Nome Alterado' WHERE cpf_paciente = '27290064275';

-- Neste momento, os dados ainda não foram commitados
-- Mas outra transação pode ler as alterações não commitadas

-- Sessão 2 (Transação concorrente)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
SELECT nome_completo FROM paciente WHERE cpf_paciente = '27290064275';
-- Resultado: 'Nome Alterado' (leitura suja - dados não commitados)

-- Sessão 1
ROLLBACK; -- Cancela a alteração

-- Sessão 2
SELECT nome_completo FROM paciente WHERE cpf_paciente = '27290064275';
-- Resultado: Volta ao valor original
COMMIT;

-- Ambas as sessões devem usar READ COMMITTED
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Sessão 1
START TRANSACTION;
UPDATE paciente SET nome_completo = 'Nome Alterado' WHERE cpf_paciente = '27290064275';

-- Sessão 2 tentando ler (não verá as alterações não commitadas)
SELECT nome_completo FROM paciente WHERE cpf_paciente = '27290064275';

-- Sessão 1
COMMIT;

-- Agora a Sessão 2 verá as alterações
SELECT nome_completo FROM paciente WHERE cpf_paciente = '27290064275';

-- 5 Os dois esquemas conceituais conseguem armazenar as mesmas informações? Qual a vantagem de um
-- esquema em relação ao outro? Explique e justifique sua resposta.

-- Sim, ambos os esquemas conceituais conseguem armazenar as mesmas informações
-- básicas sobre empréstimos de livros
-- O Esquema Conceitual 2 apresenta várias vantagens em relação ao primeiro:
-- Normalização mais evidente, Melhor representação da semântica do domínio

-- 6 Faça o mapeamento dos seguintes Esquemas Conceituais para o respectivo Esquema Relacional
-- Descritivo:

-- a)
-- departamento(codigo(key), nome)
-- Empregado(cpf(key), codigo(foreign key),nome,)
-- codigo referencia departamento

-- b)
-- cliente(cpf(key), nome, estadocivil, fone)
-- conjuge(cpf(key),cpfConjuge(foreign key), nome)
-- cpfConjuge referencia cliente


-- 7
-- a)
-- DF-1 (cod_artista) => nome_artista
-- DF-2 (cod_disco) => titulo_disco, qnt_musicas
-- DF-3 (cod_genero) => descricao_genero
-- DF-4 (cod_disco)=> cod_genero
-- DF-5 (data_de_producao) => cod_disco, cod_artista
-- DF-6 (cod_local) => nome_local
-- DF-7 (data_de_producao) => cod_local

-- mesclando
-- DF-1 (cod_artista) => nome_artista
-- DF-2 (cod_disco) => titulo_disco, qnt_musicas, cod_genero
-- DF-3 (cod_genero) => descricao_genero
-- DF-5 (data_de_producao) => cod_disco, cod_artista, cod_local
-- DF-6 (cod_local) => nome_local

-- b)

-- 8
-- A)
SELECT s.nome, s.email FROM servidor s 
WHERE NOT EXISTS (SELECT 1 FROM reservaauditorio r WHERE r.siape = s.siape);

-- B)
SELECT s.nome FROM servidor s 
JOIN reservaauditorio r ON s.siape = r.siape 
GROUP BY s.siape, s.nome HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM reservaauditorio GROUP BY siape) ORDER BY s.nome;

-- C) 

SELECT s.siape, s.nome AS Servidor FROM servidor s 
JOIN reservaauditorio r ON s.siape = r.siape 
WHERE r.dataHoraSolicitacao BETWEEN '2024-10-01' AND '2024-10-31' 
GROUP BY s.siape, s.nome 
HAVING COUNT(*) >= 3 
ORDER BY s.nome ASC;
