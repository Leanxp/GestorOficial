const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://jlddktlbyeiyeinzhfxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZGRrdGxieWVpeWVpbnpoZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzc0ODQsImV4cCI6MjA3Mzk1MzQ4NH0.ds0VnAuo1AOwVXP5kdErW09avurdlkIVtcKcAEJtkV8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para escapar valores SQL
function escapeSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return value.toString();
}

// Función para obtener la estructura de una tabla
async function getTableStructure(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error obteniendo estructura de ${tableName}:`, error);
    return [];
  }
}

// Función para obtener todos los datos de una tabla
async function getTableData(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error obteniendo datos de ${tableName}:`, error);
    return [];
  }
}

// Función para generar el CREATE TABLE
function generateCreateTable(tableName, columns) {
  let sql = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
  
  const columnDefs = columns.map(col => {
    let def = `  "${col.column_name}" `;
    
    // Mapear tipos de datos
    switch (col.data_type) {
      case 'character varying':
        def += `VARCHAR(${col.character_maximum_length || 255})`;
        break;
      case 'text':
        def += 'TEXT';
        break;
      case 'integer':
        def += 'INTEGER';
        break;
      case 'bigint':
        def += 'BIGINT';
        break;
      case 'numeric':
        def += `NUMERIC(${col.numeric_precision}, ${col.numeric_scale || 0})`;
        break;
      case 'boolean':
        def += 'BOOLEAN';
        break;
      case 'timestamp with time zone':
        def += 'TIMESTAMP WITH TIME ZONE';
        break;
      case 'timestamp without time zone':
        def += 'TIMESTAMP WITHOUT TIME ZONE';
        break;
      case 'date':
        def += 'DATE';
        break;
      case 'time':
        def += 'TIME';
        break;
      case 'json':
      case 'jsonb':
        def += 'JSONB';
        break;
      case 'uuid':
        def += 'UUID';
        break;
      default:
        def += col.data_type.toUpperCase();
    }
    
    // Agregar NOT NULL si es necesario
    if (col.is_nullable === 'NO') {
      def += ' NOT NULL';
    }
    
    // Agregar DEFAULT si existe
    if (col.column_default) {
      def += ` DEFAULT ${col.column_default}`;
    }
    
    return def;
  });
  
  sql += columnDefs.join(',\n');
  sql += '\n);\n\n';
  
  return sql;
}

// Función para generar los INSERTs
function generateInserts(tableName, data, columns) {
  if (data.length === 0) return '';
  
  let sql = `-- Datos para la tabla "${tableName}"\n`;
  
  // Generar INSERTs en lotes para mejor rendimiento
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    sql += `INSERT INTO "${tableName}" (`;
    sql += columns.map(col => `"${col.column_name}"`).join(', ');
    sql += ') VALUES\n';
    
    const values = batch.map(row => {
      const rowValues = columns.map(col => escapeSqlValue(row[col.column_name]));
      return `  (${rowValues.join(', ')})`;
    });
    
    sql += values.join(',\n');
    sql += ';\n\n';
  }
  
  return sql;
}

// Función principal para crear el backup
async function createBackup() {
  try {
    console.log('Iniciando backup de la base de datos Supabase...');
    
    // Obtener lista de todas las tablas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) throw tablesError;

    console.log(`Encontradas ${tables.length} tablas:`, tables.map(t => t.table_name));

    let backupContent = `-- Backup de la base de datos Supabase
-- Generado el: ${new Date().toISOString()}
-- Base de datos: ${supabaseUrl}

-- Configuración inicial
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Deshabilitar triggers temporalmente
SET session_replication_role = replica;

`;

    // Procesar cada tabla
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Procesando tabla: ${tableName}`);
      
      // Obtener estructura de la tabla
      const columns = await getTableStructure(tableName);
      if (columns.length === 0) {
        console.log(`  ⚠️  No se pudo obtener estructura para ${tableName}`);
        continue;
      }
      
      // Generar CREATE TABLE
      backupContent += generateCreateTable(tableName, columns);
      
      // Obtener datos de la tabla
      const data = await getTableData(tableName);
      console.log(`  📊 ${data.length} registros encontrados`);
      
      // Generar INSERTs
      if (data.length > 0) {
        backupContent += generateInserts(tableName, data, columns);
      }
    }

    // Restaurar configuración
    backupContent += `
-- Restaurar configuración
SET session_replication_role = DEFAULT;

-- Backup completado
`;

    // Generar nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + 'T' + 
                     new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
    const filename = `backup_supabase_${timestamp}.sql`;
    
    // Escribir archivo
    fs.writeFileSync(filename, backupContent, 'utf8');
    
    console.log(`\n✅ Backup completado exitosamente!`);
    console.log(`📁 Archivo generado: ${filename}`);
    console.log(`📊 Tamaño del archivo: ${(fs.statSync(filename).size / 1024 / 1024).toFixed(2)} MB`);
    
    return filename;
    
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    throw error;
  }
}

// Ejecutar backup si se llama directamente
if (require.main === module) {
  createBackup()
    .then(filename => {
      console.log(`\n🎉 Backup finalizado: ${filename}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { createBackup };
