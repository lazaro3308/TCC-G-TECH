CREATE DATABASE IF NOT EXISTS g_tech_suporte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE g_tech_suporte;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  empresa VARCHAR(160) NULL,
  telefone VARCHAR(30) NULL,
  perfil ENUM('cliente','tecnico','admin') NOT NULL DEFAULT 'cliente',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuarios_perfil (perfil, ativo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chamados (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(32) NOT NULL UNIQUE,
  cliente_id BIGINT UNSIGNED NOT NULL,
  tecnico_id BIGINT UNSIGNED NULL,
  titulo VARCHAR(160) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  prioridade ENUM('Baixa','Normal','Alta','Urgente') NOT NULL DEFAULT 'Normal',
  status ENUM('Aguardando atendimento','Em atendimento','Aguardando cliente','Resolvido','Cancelado') NOT NULL DEFAULT 'Aguardando atendimento',
  descricao TEXT NOT NULL,
  resposta_tecnica TEXT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chamados_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  CONSTRAINT fk_chamados_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
  INDEX idx_chamados_status_data (status, criado_em),
  INDEX idx_chamados_cliente_data (cliente_id, criado_em),
  INDEX idx_chamados_tecnico_status_data (tecnico_id, status, criado_em)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS historico_chamados (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  chamado_id BIGINT UNSIGNED NOT NULL,
  autor_id BIGINT UNSIGNED NOT NULL,
  status_anterior VARCHAR(40) NULL,
  status_novo VARCHAR(40) NULL,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_historico_chamado FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE,
  CONSTRAINT fk_historico_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id),
  INDEX idx_historico_chamado_data (chamado_id, criado_em)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS solicitacoes_tecnicos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(30) NULL,
  status ENUM('pendente','aprovada','recusada') NOT NULL DEFAULT 'pendente',
  analisado_por BIGINT UNSIGNED NULL,
  analisado_em TIMESTAMP NULL,
  motivo_recusa VARCHAR(500) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_solicitacao_admin FOREIGN KEY (analisado_por) REFERENCES usuarios(id),
  INDEX idx_solicitacoes_status_data (status, criado_em),
  UNIQUE KEY uq_solicitacoes_tecnicos_email (email)
) ENGINE=InnoDB;
