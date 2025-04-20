import { NextResponse } from 'next/server';
import '../../../db';

/**
 * Esta ruta API inicia la inicialización de la base de datos
 * y proporciona información sobre el estado de la misma.
 * 
 * Nota: La inicialización real ocurre en el archivo singleton.ts
 * que se importa arriba. Esta ruta solo es un mecanismo para
 * consultar el estado y forzar la inicialización.
 */
export async function GET() {
  return NextResponse.json({
    message: 'Database initialization triggered',
    info: 'La base de datos se inicializa automáticamente al arrancar el servidor',
    status: 'OK'
  });
}
