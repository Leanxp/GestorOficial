-- Script simple para agregar la columna created_at
-- Ejecutar en Supabase SQL Editor

-- Agregar columna created_at
ALTER TABLE admin_usuarios 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar registros existentes
UPDATE admin_usuarios 
SET created_at = last_update 
WHERE created_at IS NULL;
