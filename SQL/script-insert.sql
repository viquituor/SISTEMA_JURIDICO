       
        
/* insert advocacia */

-- INSERÇÕES NA TABELA: cliente
INSERT INTO cliente (CPF, nome, UF, cidade, bairro, logradouro, numero, CEP, email) VALUES
('12345678901', 'Carlos Pereira', 'SP', 'São Paulo', 'Vila Mariana', 'Rua das Flores', '100', '04123010', 'carlos.pereira@gmail.com'),
('98765432109', 'Fernanda Costa', 'RJ', 'Rio de Janeiro', 'Copacabana', 'Av. Atlântica', '250', '22041030', 'fernanda.costa@hotmail.com'),
('45678912300', 'Roberto Dias', 'MG', 'Belo Horizonte', 'Savassi', 'Av. Afonso Pena', '350', '30130100', 'roberto.dias@yahoo.com'),
('32165498700', 'Mariana Silva', 'RS', 'Porto Alegre', 'Moinhos de Vento', 'Rua Padre Chagas', '45', '90510100', 'mariana.silva@outlook.com'),
('15975348620', 'Eduardo Souza', 'PR', 'Curitiba', 'Batel', 'Rua XV de Novembro', '89', '80020300', 'eduardo.souza@empresa.com');


-- INSERÇÕES NA TABELA: advogado  
INSERT INTO advogado (OAB, nome, email, logradouro, cidade, bairro, UF, numero, CEP) VALUES
('123456', 'JOSE CASTRO', 'joao.almeida@advocacia.com', 'Rua das Palmeiras', 'São Paulo', 'Centro', 'SP', '120', '01001000'),
('234567', 'AMELIA BITTECOURT', 'maria.souza@advocacia.com', 'Av. Brasil', 'Rio de Janeiro', 'Copacabana', 'RJ', '320', '22041000'),
('345678', 'TULIO SENA', 'ricardo.lima@advocacia.com', 'Rua XV de Novembro', 'Curitiba', 'Centro', 'PR', '45', '80020000');


-- INSERÇÕES NA TABELA: contrato  
-- Aqui, os valores de OAB e CPF referenciam os advogados e clientes inseridos anteriormente.
INSERT INTO contrato (OAB, CPF, data_inicio, tipo_servico, status_contrato, descricao, data_distrato, valor) VALUES
('123456', '12345678901', '2023-01-15', 'civil', 'ganho', 'Ação de indenização', NULL, 5000.00),
('234567', '98765432109', '2023-02-20', 'trabalho', 'cancelado', 'Reintegração', '2023-05-01', 7500.00),
('123456', '45678912300', '2023-03-10', 'criminal', 'perdido', 'Defesa criminal', '2023-09-15', 12000.00),
('123456', '32165498700', '2023-04-05', 'previdenciario', 'ganho', 'Revisão de benefício', NULL, 3000.00),
('123456', '15975348620', '2023-05-12', 'consumidor', 'ganho', 'Ação contra empresa', NULL, 4500.00),
('123456', '12345678901', '2023-06-18', 'assesoria e consultoria', 'perdido', 'Consultoria jurídica', NULL, 6500.00);

-- INSERÇÕES NA TABELA: documento  
-- Utilizando os cod_contrato gerados (1 a 10)
INSERT INTO documento (cod_contrato, nome, link) VALUES
(1, 'Procuração', 'https://exemplo.com/docs/procuracao1.pdf'),
(2, 'Contrato de Trabalho', 'https://exemplo.com/docs/contrato2.pdf'),
(3, 'Sentença Judicial', 'https://exemplo.com/docs/sentenca3.pdf'),
(4, 'Laudo Pericial', 'https://exemplo.com/docs/laudo4.pdf'),
(5, 'Parecer Técnico', 'https://exemplo.com/docs/parecer5.pdf'),
(6, 'Notificação Extrajudicial', 'https://exemplo.com/docs/notificacao6.pdf'),
(1, 'Despacho Judicial', 'https://exemplo.com/docs/despacho7.pdf'),
(2, 'Petição Inicial', 'https://exemplo.com/docs/peticao8.pdf'),
(3, 'Acordo Extrajudicial', 'https://exemplo.com/docs/acordo9.pdf'),
(4, 'Termo de Ajuste', 'https://exemplo.com/docs/termo10.pdf');

-- INSERÇÕES NA TABELA: processo  
INSERT INTO processo (num_processo, cod_contrato, status_processo, descricao) VALUES
('202301150001', 1, 'concluido', 'Processo finalizado com sucesso'),
('202302200002', 1, 'cancelado', 'Processo arquivado sem julgamento'),
('202303100003', 4, 'em andamento', 'Audiência marcada para 2023-08-15'),
('202304050004', 2, 'concluido', 'Sentença favorável ao cliente'),
('202305120005', 5, 'em andamento', 'Processo em fase de instrução'),
('202306180006', 1, 'cancelado', 'Caso encerrado por acordo extrajudicial'),
('202307220007', 2, 'concluido', 'Decisão judicial definitiva'),
('202308300008', 3, 'em andamento', 'Aguardando audiência de conciliação');



-- INSERÇÕES NA TABELA: pagamento  
INSERT INTO pagamento (cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago) VALUES
(1, '2023-02-01', '2023-02-05', 'Primeira parcela', 'concluido', 'pix', 2500.00),
(2, '2023-03-05', '2023-03-10', 'Pagamento adiantado', 'concluido', 'debito', 3750.00),
(3, '2023-04-10', '2023-04-15', 'Honorários iniciais', 'em andamento', 'credito', 6000.00),
(4, '2023-05-20', '2023-05-25', 'Parcela única', 'concluido', 'boleto', 3000.00),
(5, '2023-06-18', '2023-06-23', 'Pagamento final', 'concluido', 'pix', 4500.00),
(6, '2023-07-12', '2023-07-17', 'Adiantamento', 'em andamento', 'especie', 3250.00),
(1, '2023-08-08', '2023-08-13', 'Parcela intermediária', 'em atraso', 'parcelado', 2600.00),
(2, '2023-09-05', '2023-09-10', 'Pagamento parcial', 'concluido', 'credito', 1900.00),
(3, '2023-10-02', '2023-10-07', 'Parcela final', 'concluido', 'pix', 4050.00),
(4, '2023-11-01', '2023-11-06', 'Pagamento único', 'em andamento', 'boleto', 3450.00);

-- INSERÇÕES NA TABELA: agenda  
INSERT INTO agenda (cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso) VALUES
(1, '2023-04-05', 'Audiência Cível', 'Tribunal de Justiça - SP', 'comparecido'),
(1, '2023-05-10', 'Reunião Trabalhista', 'Escritório - RJ', 'remarcado'),
(2, '2023-06-15', 'Julgamento Criminal', 'Fórum Central - BH', 'cancelado'),
(2, '2023-07-20', 'Consulta Previdenciária', 'Reunião com cliente - POA', 'comparecido'),
(3, '2023-08-25', 'Sessão de Mediação', 'Mediação entre as partes', 'remarcado'),
(3, '2023-09-30', 'Audiência de Instrução', 'Audiência para coleta de provas', 'comparecido'),
(4, '2023-10-15', 'Reunião Estratégica', 'Discussão de estratégia', 'comparecido'),
(4, '2023-11-20', 'Vistoria Técnica', 'Local do fato', 'cancelado'),
(5, '2023-12-05', 'Reunião de Conciliação', 'Tentativa de acordo', 'comparecido'),
(6, '2024-01-10', 'Audiência Final', 'Julgamento final do processo', 'remarcado'),
(5, '2023-04-05', 'Audiência Cível', 'Tribunal de Justiça - SP', 'comparecido'),
(6, '2023-05-10', 'Reunião Trabalhista', 'Escritório - RJ', 'remarcado'),
(1, '2023-06-15', 'Julgamento Criminal', 'Fórum Central - BH', 'cancelado'),
(6, '2023-07-20', 'Consulta Previdenciária', 'Reunião com cliente - POA', 'comparecido'),
(1, '2023-08-25', 'Sessão de Mediação', 'Mediação entre as partes', 'remarcado'),
(6, '2023-09-30', 'Audiência de Instrução', 'Audiência para coleta de provas', 'comparecido'),
(2, '2023-10-15', 'Reunião Estratégica', 'Discussão de estratégia', 'comparecido'),
(2, '2023-11-20', 'Vistoria Técnica', 'Local do fato', 'cancelado'),
(3, '2023-12-05', 'Reunião de Conciliação', 'Tentativa de acordo', 'comparecido');



-- INSERÇÕES NA TABELA: telefone_cli  
-- Cada cliente recebe um telefone; os telefones abaixo não seguem ordem sequencial.
INSERT INTO telefone_cli (telefone, CPF) VALUES
('11987654321', '12345678901'),
('21976543210', '98765432109'),
('31965437219', '45678912300'),
('41954326198', '32165498700');


-- INSERÇÕES NA TABELA: telefone_ADV  
-- Cada advogado recebe um telefone, valores fictícios variados.
INSERT INTO telefone_ADV (telefone, OAB) VALUES
('11912345678', '123456'),
('21923456789', '234567'),
('31934567890', '345678');

SELECT * from contrato;
