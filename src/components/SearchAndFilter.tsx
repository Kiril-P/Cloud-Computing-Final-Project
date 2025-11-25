import React from 'react';
import { Search } from 'lucide-react';
import { Area } from '../types';

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
    <div className="bg-[#1E293B] rounded-lg shadow-md p-4 mb-6 border border-[#334155]">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-white placeholder-[#9CA3AF]"
          />
        </div>

        {/* Area Filter */}
        <div className="md:w-48">
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value as Area | 'All')}
            className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent cursor-pointer text-white"
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