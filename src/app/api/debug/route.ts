import { NextResponse } from 'next/server';
import db from '../../../db';
import { users } from '../../../db/schema';
import { hashPassword } from '../../../lib/auth/utils';

/**
 * Endpoint de diagnóstico para verificar los usuarios en la base de datos
 * SOLO PARA USO EN DESARROLLO
 */
export async function GET() {
  try {
    // Obtener todos los usuarios
    const allUsers = await db.select().from(users);
    
    // Mostrar el hash calculado para una contraseña conocida
    const calculatedHash = hashPassword('admin123');
    
    return NextResponse.json({
      users: allUsers.map(u => ({
        username: u.username,
        passwordHash: u.passwordHash,
      })),
      debug: {
        calculatedHashForAdmin123: calculatedHash,
        // Comparar si alguno de los hashes almacenados coincide con el calculado
        matches: allUsers.map(u => ({
          username: u.username,
          matches: u.passwordHash === calculatedHash
        }))
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
