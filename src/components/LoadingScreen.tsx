import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Componente de pantalla de carga
 * Muestra un indicador de carga con un mensaje opcional
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Inicializando aplicación...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/50 rounded-full border-t-indigo-500 animate-spin mb-4 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-600">Por favor espere mientras preparamos todo para usted.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
