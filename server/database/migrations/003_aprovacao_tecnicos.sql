-- G-TECH | Migração 003
-- Habilita contas administrativas e fluxo de solicitação/aprovação de técnicos.
-- Não remove nem modifica os registros existentes.

USE g_tech_suporte;

ALTER TABLE usuarios
  MODIFY COLUMN perfil ENUM('cliente','tecnico','admin') NOT NULL DEFAULT 'cliente';

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
