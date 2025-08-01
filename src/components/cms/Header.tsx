import React from "react";
import { Icon } from "astro-icon";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Icon name="material-symbols:add" className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              aria-label="Notificaciones"
              title="Notificaciones"
            >
              <Icon name="material-symbols:notifications" className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png"
              alt="Usuario"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">Sergio Rondón</span>
          </div>
        </div>
      </div>
    </header>
  );
}; 