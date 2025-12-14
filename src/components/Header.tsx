import { Home } from 'lucide-react';
import logoImage from "../assets/new_logo.png";

interface HeaderProps {
  title: string;
  onHomeClick?: () => void;
}

export function Header({ title, onHomeClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-200 text-gray-700"
              aria-label="Go home"
            >
              <Home className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-[#1a1a1a] font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <img src={logoImage} alt="NomNomNow" className="h-12" />
        </div>
      </div>
    </header>
  );
}