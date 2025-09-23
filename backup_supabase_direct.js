const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase - necesitarás obtener las credenciales de conexión directa
const SUPABASE_CONFIG = {
  // Reemplaza estos valores con los de tu proyecto Supabase
  // Ve a Settings > Database en tu panel de Supabase para obtener estos datos
  host: 'db.jlddktlbyeiyeinzhfxx.supabase.co',
  port: '5432',
  database: 'postgres',
  username: 'postgres',
  password: 'TU_PASSWORD_AQUI', // Necesitas obtener esto del panel de Supabase
};

// Función para verificar si pg_dump está disponible
function checkPgDump() {
  return new Promise((resolve, reject) => {
    exec('pg_dump --version', (error, stdout, stderr) => {
      if (error) {
        reject(new Error('pg_dump no está instalado o no está en el PATH'));
      } else {
        console.log('✅ pg_dump encontrado:', stdout.trim());
        resolve(true);
      }
    });
  });
}

// Función para crear el backup usando pg_dump
function createBackupWithPgDump() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + 'T' + 
                     new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
    const filename = `backup_supabase_${timestamp}.sql`;
    
    // Configurar variables de entorno para la contraseña
    const env = {
      ...process.env,
      PGPASSWORD: SUPABASE_CONFIG.password
    };
    
    // Comando pg_dump con todas las opciones necesarias
    const command = `pg_dump --host=${SUPABASE_CONFIG.host} --port=${SUPABASE_CONFIG.port} --username=${SUPABASE_CONFIG.username} --dbname=${SUPABASE_CONFIG.database} --verbose --clean --if-exists --create --inserts --column-inserts --disable-triggers --no-owner --no-privileges --file=${filename}`;
    
    console.log('🚀 Ejecutando pg_dump...');
    console.log(`📁 Archivo de destino: ${filename}`);
    
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error ejecutando pg_dump:', error.message);
        if (stderr) {
          console.error('📋 Detalles del error:', stderr);
        }
        reject(error);
        return;
      }
      
      if (stderr) {
        console.log('📋 Información de pg_dump:', stderr);
      }
      
      // Verificar que el archivo se creó correctamente
      if (fs.existsSync(filename)) {
        const stats = fs.statSync(filename);
        console.log(`\n✅ Backup completado exitosamente!`);
        console.log(`📁 Archivo generado: ${filename}`);
        console.log(`📊 Tamaño del archivo: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📅 Fecha de creación: ${stats.birthtime.toISOString()}`);
        resolve(filename);
      } else {
        reject(new Error('El archivo de backup no se creó correctamente'));
      }
    });
  });
}

// Función principal
async function createBackup() {
  try {
    console.log('🔍 Verificando dependencias...');
    await checkPgDump();
    
    console.log('\n🔐 Verificando configuración...');
    if (SUPABASE_CONFIG.password === 'TU_PASSWORD_AQUI') {
      console.log('❌ Error: Necesitas configurar la contraseña de la base de datos');
      console.log('\n📋 Instrucciones:');
      console.log('1. Ve a https://app.supabase.io/');
      console.log('2. Selecciona tu proyecto');
      console.log('3. Ve a Settings > Database');
      console.log('4. Copia la contraseña de la base de datos');
      console.log('5. Reemplaza "TU_PASSWORD_AQUI" en este archivo con la contraseña real');
      console.log('\n🔗 URL de conexión directa:');
      console.log(`Host: ${SUPABASE_CONFIG.host}`);
      console.log(`Puerto: ${SUPABASE_CONFIG.port}`);
      console.log(`Base de datos: ${SUPABASE_CONFIG.database}`);
      console.log(`Usuario: ${SUPABASE_CONFIG.username}`);
      return;
    }
    
    console.log('✅ Configuración verificada');
    
    console.log('\n🚀 Iniciando backup de la base de datos...');
    const filename = await createBackupWithPgDump();
    
    console.log('\n🎉 ¡Backup completado exitosamente!');
    console.log(`📁 Archivo: ${filename}`);
    console.log('\n📋 El archivo contiene:');
    console.log('  • Estructura completa de todas las tablas (CREATE TABLE)');
    console.log('  • Todos los datos con INSERT statements');
    console.log('  • Configuración de la base de datos');
    console.log('  • Índices y restricciones');
    
    return filename;
    
  } catch (error) {
    console.error('\n💥 Error durante el backup:', error.message);
    
    if (error.message.includes('pg_dump no está instalado')) {
      console.log('\n📋 Para instalar PostgreSQL y pg_dump:');
      console.log('Windows: https://www.postgresql.org/download/windows/');
      console.log('macOS: brew install postgresql');
      console.log('Linux: sudo apt-get install postgresql-client');
    }
    
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createBackup()
    .then(filename => {
      console.log(`\n🎯 Backup finalizado: ${filename}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error fatal:', error.message);
      process.exit(1);
    });
}

module.exports = { createBackup };
