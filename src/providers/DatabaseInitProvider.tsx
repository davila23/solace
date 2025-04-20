'use client';

import React from 'react';

interface DatabaseInitProviderProps {
  children: React.ReactNode;
}

/**
 * Proveedor para la gestión de la base de datos
 * 
 * Esta versión simplificada no realiza comprobaciones redundantes
 * ya que la inicialización de la base de datos se maneja a través 
 * del patrón singleton implementado directamente en src/db/index.ts
 */
const DatabaseInitProvider: React.FC<DatabaseInitProviderProps> = ({ children }) => {

  // Simplemente renderiza los hijos sin comprobaciones adicionales
  // La inicialización de la base de datos ya se maneja en el singleton
  return <>{children}</>;
};

export default DatabaseInitProvider;
