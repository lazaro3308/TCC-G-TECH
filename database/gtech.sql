-- G-TECH | Estrutura inicial do banco de dados
-- Requisito: MySQL 8.0+
-- Execução: MySQL Workbench, DBeaver ou cliente mysql.

CREATE DATABASE IF NOT EXISTS gtech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gtech;

CREATE TABLE IF NOT EXISTS perfis (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(30) NOT NULL UNIQUE,
  descricao VARCHAR(150) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  perfil_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(25) NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_perfis FOREIGN KEY (perfil_id) REFERENCES perfis(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_usuarios_perfil_ativo (perfil_id, ativo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clientes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL UNIQUE,
  empresa VARCHAR(150) NULL,
  documento VARCHAR(30) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clientes_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chamados (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id BIGINT UNSIGNED NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  tecnico_id BIGINT UNSIGNED NULL,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('ABERTO','EM_TRIAGEM','ATRIBUIDO','EM_ATENDIMENTO','AGUARDANDO_CLIENTE','RESOLVIDO','FECHADO','CANCELADO')
    NOT NULL DEFAULT 'ABERTO',
  prioridade ENUM('BAIXA','NORMAL','ALTA','URGENTE') NOT NULL DEFAULT 'NORMAL',
  solucao TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolvido_em DATETIME NULL,
  fechado_em DATETIME NULL,
  CONSTRAINT fk_chamados_clientes FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_chamados_categorias FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_chamados_tecnicos FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_chamados_status_data (status, criado_em),
  INDEX idx_chamados_cliente (cliente_id, criado_em),
  INDEX idx_chamados_tecnico (tecnico_id, status),
  INDEX idx_chamados_categoria (categoria_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comentarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  mensagem TEXT NOT NULL,
  interno BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentarios_chamados FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_comentarios_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_comentarios_chamado_data (chamado_id, criado_em)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS historico_chamados (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  acao VARCHAR(60) NOT NULL,
  status_anterior VARCHAR(30) NULL,
  status_novo VARCHAR(30) NULL,
  detalhes JSON NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_historico_chamados FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_historico_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_historico_chamado_data (chamado_id, criado_em)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS anexos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nome_original VARCHAR(255) NOT NULL,
  nome_armazenado VARCHAR(255) NOT NULL,
  caminho_armazenamento VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  tamanho_bytes BIGINT UNSIGNED NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_anexos_chamados FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_anexos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_anexos_chamado (chamado_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notificacoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  chamado_id BIGINT UNSIGNED NULL,
  titulo VARCHAR(150) NOT NULL,
  mensagem TEXT NOT NULL,
  lida_em DATETIME NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notificacoes_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_notificacoes_chamados FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_notificacoes_usuario_lida (usuario_id, lida_em, criado_em)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS avaliacoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id BIGINT UNSIGNED NOT NULL UNIQUE,
  cliente_id BIGINT UNSIGNED NOT NULL,
  nota TINYINT UNSIGNED NOT NULL,
  comentario TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_avaliacoes_nota CHECK (nota BETWEEN 1 AND 5),
  CONSTRAINT fk_avaliacoes_chamados FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_avaliacoes_clientes FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_avaliacoes_cliente (cliente_id, criado_em)
) ENGINE=InnoDB;

INSERT IGNORE INTO perfis (nome, descricao) VALUES
('ADMIN', 'Administrador do sistema'),
('FUNCIONARIO', 'Funcionário responsável pela triagem'),
('TECNICO', 'Técnico responsável pelo atendimento'),
('CLIENTE', 'Cliente que abre e acompanha chamados');

INSERT IGNORE INTO categorias (nome, descricao) VALUES
('Hardware', 'Problemas em equipamentos e componentes'),
('Software', 'Problemas em programas e sistemas'),
('Rede e Internet', 'Conectividade e infraestrutura de rede'),
('Acesso', 'Contas, senhas e permissões'),
('Outros', 'Solicitações não classificadas nas demais categorias');

-- Não é criado administrador com senha padrão.
-- O primeiro administrador deverá ser criado por procedimento seguro no back-end.
