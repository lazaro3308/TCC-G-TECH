-- G-TECH | Migração 002
-- Aumenta a capacidade do campo de mensagem para preservar respostas técnicas completas.
-- A alteração mantém os dados já gravados.
USE g_tech_suporte;

ALTER TABLE historico_chamados
  MODIFY COLUMN mensagem TEXT NOT NULL;
