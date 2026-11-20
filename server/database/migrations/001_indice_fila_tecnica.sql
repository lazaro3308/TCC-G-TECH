-- G-TECH | Migração 001
-- Índice para acelerar filtros da fila técnica por responsável, status e data.
-- Compatível com bancos existentes: cria o índice somente se ainda não existir.
USE g_tech_suporte;

SET @gtech_index_exists = (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'chamados'
    AND index_name = 'idx_chamados_tecnico_status_data'
);

SET @gtech_index_sql = IF(
  @gtech_index_exists = 0,
  'CREATE INDEX idx_chamados_tecnico_status_data ON chamados (tecnico_id, status, criado_em)',
  'SELECT 1'
);

PREPARE gtech_index_stmt FROM @gtech_index_sql;
EXECUTE gtech_index_stmt;
DEALLOCATE PREPARE gtech_index_stmt;
