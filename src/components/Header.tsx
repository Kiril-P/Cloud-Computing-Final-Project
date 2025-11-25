import React from 'react';
import { Home } from 'lucide-react';
import logoImage from 'figma:asset/d393b9f0ee4445ba8a726796522f801553480002.png';

interface HeaderProps {
  title: string;
  onHomeClick?: () => void;
}

export function Header({ title, onHomeClick }: HeaderProps) {
  return (
    <header className="bg-[#1A2332] text-white shadow-lg sticky top-0 z-50 border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="hover:bg-[#334155] p-2 rounded-lg transition-colors border border-[#334155]"
              aria-label="Go home"
            >
              <Home className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-32 flex items-center justify-center">
            <img src={logoImage} alt="NomNomNow" className="h-32 w-32 object-contain scale-110" />
          </div>
        </div>
      </div>
    </header>
  );
}