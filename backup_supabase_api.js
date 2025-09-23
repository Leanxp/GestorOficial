const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuración de Supabase
const supabaseUrl = 'https://jlddktlbyeiyeinzhfxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZGRrdGxieWVpeWVpbnpoZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzc0ODQsImV4cCI6MjA3Mzk1MzQ4NH0.ds0VnAuo1AOwVXP5kdErW09avurdlkIVtcKcAEJtkV8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de tablas conocidas basada en el código de la aplicación
const KNOWN_TABLES = [
  'admin_usuarios',
  'categories',
  'ingredients',
  'inventory',
  'inventory_families',
  'inventory_subfamilies',
  'inventory_movements',
  'purchase_orders',
  'purchase_order_items',
  'suppliers',
  'supplier_ingredients'
];

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

// Función para obtener todos los datos de una tabla
async function getTableData(tableName) {
  try {
    console.log(`  📊 Obteniendo datos de ${tableName}...`);
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.log(`  ⚠️  Error en ${tableName}: ${error.message}`);
      return [];
    }
    
    console.log(`  ✅ ${data?.length || 0} registros encontrados en ${tableName}`);
    return data || [];
  } catch (error) {
    console.log(`  ❌ Error obteniendo datos de ${tableName}: ${error.message}`);
    return [];
  }
}

// Función para generar INSERTs básicos
function generateInserts(tableName, data) {
  if (data.length === 0) return '';
  
  let sql = `-- Datos para la tabla "${tableName}"\n`;
  
  // Obtener las columnas del primer registro
  const columns = Object.keys(data[0]);
  
  // Generar INSERTs en lotes para mejor rendimiento
  const batchSize = 50;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    sql += `INSERT INTO "${tableName}" (`;
    sql += columns.map(col => `"${col}"`).join(', ');
    sql += ') VALUES\n';
    
    const values = batch.map(row => {
      const rowValues = columns.map(col => escapeSqlValue(row[col]));
      return `  (${rowValues.join(', ')})`;
    });
    
    sql += values.join(',\n');
    sql += ';\n\n';
  }
  
  return sql;
}

// Función para crear estructura básica de tabla basada en los datos
function generateBasicTableStructure(tableName, data) {
  if (data.length === 0) {
    return `-- Tabla "${tableName}" (sin datos para inferir estructura)\n`;
  }
  
  const columns = Object.keys(data[0]);
  let sql = `-- Estructura básica para la tabla "${tableName}"\n`;
  sql += `-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.\n`;
  sql += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
  
  const columnDefs = columns.map(col => {
    const sampleValue = data[0][col];
    let dataType = 'TEXT';
    
    // Inferir tipo de dato básico
    if (typeof sampleValue === 'number') {
      if (Number.isInteger(sampleValue)) {
        dataType = 'INTEGER';
      } else {
        dataType = 'NUMERIC';
      }
    } else if (typeof sampleValue === 'boolean') {
      dataType = 'BOOLEAN';
    } else if (sampleValue instanceof Date) {
      dataType = 'TIMESTAMP';
    } else if (typeof sampleValue === 'object' && sampleValue !== null) {
      dataType = 'JSONB';
    }
    
    return `  "${col}" ${dataType}`;
  });
  
  sql += columnDefs.join(',\n');
  sql += '\n);\n\n';
  
  return sql;
}

// Función principal para crear el backup
async function createBackup() {
  try {
    console.log('🚀 Iniciando backup de la base de datos Supabase usando API...');
    console.log(`📋 Procesando ${KNOWN_TABLES.length} tablas conocidas\n`);
    
    let backupContent = `-- Backup de la base de datos Supabase
-- Generado el: ${new Date().toISOString()}
-- Base de datos: ${supabaseUrl}
-- Método: API de Supabase

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

    let totalRecords = 0;
    let successfulTables = 0;

    // Procesar cada tabla conocida
    for (const tableName of KNOWN_TABLES) {
      console.log(`📋 Procesando tabla: ${tableName}`);
      
      try {
        // Obtener datos de la tabla
        const data = await getTableData(tableName);
        
        if (data.length > 0) {
          // Generar estructura básica de tabla
          backupContent += generateBasicTableStructure(tableName, data);
          
          // Generar INSERTs
          backupContent += generateInserts(tableName, data);
          
          totalRecords += data.length;
          successfulTables++;
        } else {
          console.log(`  ⚠️  Tabla ${tableName} está vacía o no accesible`);
          backupContent += `-- Tabla "${tableName}" (vacía o no accesible)\n\n`;
        }
      } catch (error) {
        console.log(`  ❌ Error procesando ${tableName}: ${error.message}`);
        backupContent += `-- Error procesando tabla "${tableName}": ${error.message}\n\n`;
      }
    }

    // Restaurar configuración
    backupContent += `
-- Restaurar configuración
SET session_replication_role = DEFAULT;

-- Resumen del backup
-- Tablas procesadas: ${successfulTables}/${KNOWN_TABLES.length}
-- Total de registros: ${totalRecords}
-- Backup completado: ${new Date().toISOString()}
`;

    // Generar nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + 'T' + 
                     new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
    const filename = `backup_supabase_api_${timestamp}.sql`;
    
    // Escribir archivo
    fs.writeFileSync(filename, backupContent, 'utf8');
    
    console.log(`\n✅ Backup completado exitosamente!`);
    console.log(`📁 Archivo generado: ${filename}`);
    console.log(`📊 Tamaño del archivo: ${(fs.statSync(filename).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📋 Tablas procesadas: ${successfulTables}/${KNOWN_TABLES.length}`);
    console.log(`📊 Total de registros: ${totalRecords}`);
    
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
