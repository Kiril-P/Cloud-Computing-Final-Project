import { Search } from 'lucide-react';
import type { Area } from '../types';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedArea: Area | 'All';
  onAreaChange: (area: Area | 'All') => void;
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedArea,
  onAreaChange
}: SearchAndFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        {/* search bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* area filter */}
        <div className="md:w-48">
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value as Area | 'All')}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] focus:border-transparent cursor-pointer text-gray-900 font-medium"
          >
            <option value="All">All Areas</option>
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
      </div>
    </div>
  );
}