import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="block w-full pl-12 pr-32 py-4 bg-black/60 backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent text-lg shadow-2xl transition-all disabled:opacity-50"
          placeholder="Search for movies (e.g. Inception, Titanic)..."
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 bg-netflix hover:bg-red-700 text-white font-medium rounded px-6 flex items-center gap-1 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Search <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};