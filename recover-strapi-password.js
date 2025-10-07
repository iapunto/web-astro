/**
 * Script para recuperar/resetear contraseña de administrador en Strapi
 * Genera el hash bcrypt correcto para la nueva contraseña
 */

const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  const newPassword = 'Admin123!';

  try {
    // Generar hash con bcrypt (mismo algoritmo que usa Strapi)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log('🔐 NUEVA CONTRASEÑA GENERADA PARA STRAPI');
    console.log('='.repeat(50));
    console.log(`Contraseña: ${newPassword}`);
    console.log(`Hash bcrypt: ${hashedPassword}`);
    console.log('');
    console.log('📋 INSTRUCCIONES:');
    console.log('1. Conecta a tu base de datos PostgreSQL');
    console.log('2. Ejecuta el siguiente SQL:');
    console.log('');
    console.log(
      `UPDATE admin_users SET password = '${hashedPassword}' WHERE id = 1;`
    );
    console.log('');
    console.log('3. Si no existe usuario con ID 1, crea uno nuevo:');
    console.log('');
    console.log(
      `INSERT INTO admin_users (id, firstname, lastname, username, email, password, is_active, blocked, prefered_language, created_at, updated_at) VALUES (1, 'Admin', 'User', 'admin', 'admin@iapunto.com', '${hashedPassword}', true, false, 'en', NOW(), NOW());`
    );
    console.log('');
    console.log('4. Accede a Strapi con:');
    console.log(`   Usuario: admin`);
    console.log(`   Contraseña: ${newPassword}`);

    return hashedPassword;
  } catch (error) {
    console.error('❌ Error generando hash:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generatePasswordHash()
    .then(() => {
      console.log('\n✅ Hash generado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { generatePasswordHash };
