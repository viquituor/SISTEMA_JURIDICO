DROP DATABASE IF EXISTS BD_ADVOCACIA;

CREATE DATABASE BD_ADVOCACIA;

USE BD_ADVOCACIA;

/* Tabelas Principais */

CREATE TABLE cliente (
    CPF CHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    UF CHAR(2) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    logradouro VARCHAR(50) NOT NULL,
    numero VARCHAR(8) NOT NULL,
    CEP CHAR(8) NOT NULL,
    email VARCHAR(50)
);

CREATE TABLE advogado (
    OAB CHAR(6) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    logradouro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    UF CHAR(2) NOT NULL,
    numero VARCHAR(8) NOT NULL,
    CEP CHAR(8) NOT NULL
);

CREATE TABLE contrato (
    cod_contrato SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    OAB CHAR(6),
    CPF CHAR(11),
    data_inicio DATE NOT NULL,
    tipo_servico ENUM('civil','trabalho','previdenciario','criminal','consumidor','assesoria e consultoria','acompanhamentos','correspondencia juridica') NOT NULL,
    status_contrato ENUM('ganho', 'perdido','cancelado', 'em andamento'),
    descricao VARCHAR(1000) NOT NULL,
    data_distrato DATE,
    valor DECIMAL(10,2) NOT NULL
);

/* Tabelas Secundárias */

CREATE TABLE documento (
    cod_doc SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cod_contrato SMALLINT UNSIGNED,
    nome VARCHAR(50) NOT NULL,
    link VARCHAR(200) NOT NULL
);

CREATE TABLE processo (
    num_processo CHAR(18) PRIMARY KEY,
    cod_contrato SMALLINT UNSIGNED,
    status_processo ENUM('em andamento','cancelado','concluido') NOT NULL,
    descricao VARCHAR(500) NOT NULL
);

CREATE TABLE pagamento (
    cod_pag SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cod_contrato SMALLINT UNSIGNED,
    data_pag DATETIME NOT NULL,
    data_vencimento DATE NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    status_pag ENUM('concluido', 'em andamento', 'em atraso') NOT NULL,
    metodo ENUM('pix','especie','parcelado', 'boleto','credito','debito') NOT NULL,
    valorPago DECIMAL(10,2) NOT NULL
);

CREATE TABLE agenda (
    cod_compromisso SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cod_contrato SMALLINT UNSIGNED NULL,
    data_compromisso DATE NOT NULL,
    nome_compromisso VARCHAR(50) NOT NULL,
    descricao VARCHAR(500),
    status_compromisso ENUM('comparecido', 'perdido', 'cancelado','remarcado', 'pendente') NOT NULL
);

CREATE TABLE prazo_de_processo (
    cod_prapro smallint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    num_processo CHAR(18),
    descritao_prapro VARCHAR(100) NOT NULL,
    data_prapro DATE NOT NULL,
    nome_prapro VARCHAR(50) NOT NULL,
    status_prapro ENUM('pendente', 'concluído', 'adiado', 'cancelado') NOT NULL

    );

/* Tabelas de Relacionamento */

CREATE TABLE telefone_cli (
    telefone CHAR(11),
    CPF CHAR(11),
    PRIMARY KEY (CPF, telefone)
);

CREATE TABLE telefone_ADV (
    telefone CHAR(11),
    OAB CHAR(6),
    PRIMARY KEY (OAB, telefone)
);

/* Constraints de Chave Estrangeira */

ALTER TABLE contrato ADD CONSTRAINT FK_contrato_cliente
    FOREIGN KEY (CPF) REFERENCES cliente (CPF)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE contrato ADD CONSTRAINT FK_contrato_advogado
    FOREIGN KEY (OAB) REFERENCES advogado (OAB)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE documento ADD CONSTRAINT FK_documento_contrato
    FOREIGN KEY (cod_contrato) REFERENCES contrato (cod_contrato)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE processo ADD CONSTRAINT FK_processo_contrato
    FOREIGN KEY (cod_contrato) REFERENCES contrato (cod_contrato)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE pagamento ADD CONSTRAINT FK_pagamento_contrato
    FOREIGN KEY (cod_contrato) REFERENCES contrato (cod_contrato)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE agenda ADD CONSTRAINT FK_agenda_contrato
    FOREIGN KEY (cod_contrato) REFERENCES contrato (cod_contrato)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE telefone_cli ADD CONSTRAINT FK_telefone_cliente
    FOREIGN KEY (CPF) REFERENCES cliente (CPF)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE telefone_ADV ADD CONSTRAINT FK_telefone_advogado
    FOREIGN KEY (OAB) REFERENCES advogado (OAB)
    ON UPDATE CASCADE;

ALTER TABLE prazo_de_processo ADD CONSTRAINT FK_prazo_processo FOREIGN KEY (num_processo) 
        REFERENCES processo (num_processo)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
        
        
        