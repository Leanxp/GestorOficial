-- Script para arreglar la tabla admin_usuarios existente
-- Ejecutar este script en Supabase para agregar la columna created_at

-- Agregar columna created_at si no existe
ALTER TABLE admin_usuarios 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar registros existentes con created_at basado en last_update
UPDATE admin_usuarios 
SET created_at = last_update 
WHERE created_at IS NULL;

-- Verificar que la tabla esté correcta
SELECT 
  id,
  username,
  email,
  license_type,
  is_admin,
  created_at,
  last_update
FROM admin_usuarios 
ORDER BY created_at DESC;
