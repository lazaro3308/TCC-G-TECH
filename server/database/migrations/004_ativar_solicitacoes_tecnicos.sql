-- G-TECH | Migração 004
-- Converte solicitações técnicas pendentes em contas ativas.
-- Não sobrescreve usuários existentes nem remove o histórico de solicitações.
USE g_tech_suporte;

START TRANSACTION;

INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil, ativo)
SELECT
  s.nome,
  LOWER(TRIM(s.email)),
  s.senha_hash,
  s.telefone,
  'tecnico',
  1
FROM solicitacoes_tecnicos s
WHERE s.status = 'pendente'
  AND NOT EXISTS (
    SELECT 1
    FROM usuarios u
    WHERE LOWER(u.email) = LOWER(TRIM(s.email))
  );

UPDATE solicitacoes_tecnicos s
INNER JOIN usuarios u
  ON LOWER(u.email) = LOWER(TRIM(s.email))
 AND u.perfil = 'tecnico'
SET
  s.status = 'aprovada',
  s.analisado_por = NULL,
  s.analisado_em = COALESCE(s.analisado_em, CURRENT_TIMESTAMP),
  s.motivo_recusa = NULL
WHERE s.status = 'pendente';

COMMIT;
