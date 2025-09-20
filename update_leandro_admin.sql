-- Script para actualizar el usuario Leandro como administrador
-- Ejecutar este script en Supabase para actualizar el usuario existente

UPDATE admin_usuarios 
SET 
  is_admin = true,
  license_type = 'premium',
  license_expires_at = '2026-12-31 23:59:59',
  max_ingredients = 999999,
  max_suppliers = 999999,
  last_update = NOW()
WHERE email = 'leandrocalvoduran@gmail.com';

-- Verificar que la actualización fue exitosa
SELECT 
  username,
  email,
  license_type,
  is_admin,
  max_ingredients,
  max_suppliers,
  license_expires_at
FROM admin_usuarios 
WHERE email = 'leandrocalvoduran@gmail.com';
