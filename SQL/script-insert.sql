/* insert advocacia */

-- INSERÇÕES NA TABELA: cliente
INSERT INTO cliente (CPF, nome, UF, cidade, bairro, logradouro, numero, CEP, email) VALUES
('12345678901', 'Carlos Pereira', 'SP', 'São Paulo', 'Vila Mariana', 'Rua das Flores', '100', '04123010', 'carlos.pereira@gmail.com'),
('98765432109', 'Fernanda Costa', 'RJ', 'Rio de Janeiro', 'Copacabana', 'Av. Atlântica', '250', '22041030', 'fernanda.costa@hotmail.com'),
('45678912300', 'Roberto Dias', 'MG', 'Belo Horizonte', 'Savassi', 'Av. Afonso Pena', '350', '30130100', 'roberto.dias@yahoo.com'),
('32165498700', 'Mariana Silva', 'RS', 'Porto Alegre', 'Moinhos de Vento', 'Rua Padre Chagas', '45', '90510100', 'mariana.silva@outlook.com'),
('15975348620', 'Eduardo Souza', 'PR', 'Curitiba', 'Batel', 'Rua XV de Novembro', '89', '80020300', 'eduardo.souza@empresa.com'),
('75315948620', 'Patrícia Lima', 'SC', 'Florianópolis', 'Centro', 'Av. Beira-Mar', '150', '88015300', 'patricia.lima@gmail.com'),
('85296374102', 'Ricardo Almeida', 'SP', 'Campinas', 'Cambuí', 'Rua São Paulo', '210', '13015100', 'ricardo.almeida@mail.com'),
('96385274103', 'Juliana Martins', 'RJ', 'Niterói', 'Icaraí', 'Rua Barata Ribeiro', '77', '24320050', 'juliana.martins@hotmail.com'),
('74185296304', 'André Santos', 'MG', 'Uberlândia', 'Centro', 'Av. Getúlio Vargas', '300', '38400100', 'andre.santos@empresa.com'),
('15935748620', 'Cláudia Ribeiro', 'SP', 'Santos', 'Embaré', 'Rua do Sol', '12', '11015200', 'claudia.ribeiro@yahoo.com');

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
('567890', '15975348620', '2023-05-12', 'consumidor', 'ganho', 'Ação contra empresa', NULL, 4500.00),
('678901', '75315948620', '2023-06-18', 'assesoria e consultoria', 'perdido', 'Consultoria jurídica', NULL, 6500.00),
('123456', '85296374102', '2023-07-22', 'acompanhamentos', 'perdido', 'Acompanhamento processual', '2023-10-10', 5200.00),
('890123', '96385274103', '2023-08-30', 'correspondencia juridica', 'ganho', 'Envio de documentos', NULL, 3800.00),
('123456', '74185296304', '2023-09-25', 'civil', 'cancelado', 'Ação de divórcio', '2023-11-30', 8100.00),
('012345', '15935748620', '2023-10-14', 'trabalho', 'ganho', 'Ação trabalhista', NULL, 6900.00);

-- INSERÇÕES NA TABELA: documento  
-- Utilizando os cod_contrato gerados (1 a 10)
INSERT INTO documento (cod_contrato, nome, conteudo) VALUES
(1, 'Procuração', 'https://exemplo.com/docs/procuracao1.pdf'),
(2, 'Contrato de Trabalho', 'https://exemplo.com/docs/contrato2.pdf'),
(3, 'Sentença Judicial', 'https://exemplo.com/docs/sentenca3.pdf'),
(4, 'Laudo Pericial', 'https://exemplo.com/docs/laudo4.pdf'),
(5, 'Parecer Técnico', 'https://exemplo.com/docs/parecer5.pdf'),
(6, 'Notificação Extrajudicial', 'https://exemplo.com/docs/notificacao6.pdf'),
(7, 'Despacho Judicial', 'https://exemplo.com/docs/despacho7.pdf'),
(8, 'Petição Inicial', 'https://exemplo.com/docs/peticao8.pdf'),
(9, 'Acordo Extrajudicial', 'https://exemplo.com/docs/acordo9.pdf'),
(10, 'Termo de Ajuste', 'https://exemplo.com/docs/termo10.pdf');

-- INSERÇÕES NA TABELA: processo  
INSERT INTO processo (num_processo, cod_contrato, status_processo, descricao) VALUES
('202301150001', 1, 'concluido', 'Processo finalizado com sucesso'),
('202302200002', 2, 'cancelado', 'Processo arquivado sem julgamento'),
('202303100003', 3, 'em andamento', 'Audiência marcada para 2023-08-15'),
('202304050004', 4, 'concluido', 'Sentença favorável ao cliente'),
('202305120005', 5, 'em andamento', 'Processo em fase de instrução'),
('202306180006', 6, 'cancelado', 'Caso encerrado por acordo extrajudicial'),
('202307220007', 7, 'concluido', 'Decisão judicial definitiva'),
('202308300008', 8, 'em andamento', 'Aguardando audiência de conciliação'),
('202309250009', 9, 'concluido', 'Julgamento procedente'),
('202310140010', 10, 'cancelado', 'Recurso indeferido');

-- INSERÇÕES NA TABELA: pagamento  
INSERT INTO pagamento (cod_contrato, data_pag, data_vencimento, descricao, status_pag, metodo, valorPago) VALUES
(1, '2023-02-01 10:30:00', '2023-02-05', 'Primeira parcela', 'concluido', 'pix', 2500.00),
(2, '2023-03-05 14:20:00', '2023-03-10', 'Pagamento adiantado', 'concluido', 'debito', 3750.00),
(3, '2023-04-10 16:50:00', '2023-04-15', 'Honorários iniciais', 'em andamento', 'credito', 6000.00),
(4, '2023-05-20 09:15:00', '2023-05-25', 'Parcela única', 'concluido', 'boleto', 3000.00),
(5, '2023-06-18 11:00:00', '2023-06-23', 'Pagamento final', 'concluido', 'pix', 4500.00),
(6, '2023-07-12 15:30:00', '2023-07-17', 'Adiantamento', 'em andamento', 'especie', 3250.00),
(7, '2023-08-08 13:45:00', '2023-08-13', 'Parcela intermediária', 'em atraso', 'parcelado', 2600.00),
(8, '2023-09-05 10:10:00', '2023-09-10', 'Pagamento parcial', 'concluido', 'credito', 1900.00),
(9, '2023-10-02 14:30:00', '2023-10-07', 'Parcela final', 'concluido', 'pix', 4050.00),
(10, '2023-11-01 17:00:00', '2023-11-06', 'Pagamento único', 'em andamento', 'boleto', 3450.00);

-- INSERÇÕES NA TABELA: agenda  
INSERT INTO agenda (cod_contrato, data_compromisso, nome_compromisso, descricao, status_compromisso) VALUES
(1, '2023-04-05', 'Audiência Cível', 'Tribunal de Justiça - SP', 'comparecido'),
(3, '2023-05-10', 'Reunião Trabalhista', 'Escritório - RJ', 'remarcado'),
(3, '2023-06-15', 'Julgamento Criminal', 'Fórum Central - BH', 'cancelado'),
(4, '2023-07-20', 'Consulta Previdenciária', 'Reunião com cliente - POA', 'comparecido'),
(4, '2023-08-25', 'Sessão de Mediação', 'Mediação entre as partes', 'remarcado'),
(7, '2023-09-30', 'Audiência de Instrução', 'Audiência para coleta de provas', 'comparecido'),
(7, '2023-10-15', 'Reunião Estratégica', 'Discussão de estratégia', 'comparecido'),
(9, '2023-11-20', 'Vistoria Técnica', 'Local do fato', 'cancelado'),
(9, '2023-12-05', 'Reunião de Conciliação', 'Tentativa de acordo', 'comparecido'),
(10, '2024-01-10', 'Audiência Final', 'Julgamento final do processo', 'remarcado');

-- INSERÇÕES NA TABELA: telefone_cli  
-- Cada cliente recebe um telefone; os telefones abaixo não seguem ordem sequencial.
INSERT INTO telefone_cli (telefone, CPF) VALUES
('11987654321', '12345678901'),
('21976543210', '98765432109'),
('31965437219', '45678912300'),
('41954326198', '32165498700'),
('51943215087', '15975348620'),
('61932104976', '75315948620'),
('71921093865', '85296374102'),
('81910982754', '96385274103'),
('91909871643', '74185296304'),
('01998760532', '15935748620');

-- INSERÇÕES NA TABELA: telefone_ADV  
-- Cada advogado recebe um telefone, valores fictícios variados.
INSERT INTO telefone_ADV (telefone, OAB) VALUES
('11912345678', '123456'),
('21923456789', '234567'),
('31934567890', '345678'),
('41945678901', '456789'),
('51956789012', '567890'),
('61967890123', '678901'),
('71978901234', '789012'),
('81989012345', '890123'),
('91990123456', '901234'),
('01901234567', '012345');



