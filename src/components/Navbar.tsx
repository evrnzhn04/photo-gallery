'use client';

import { useState } from 'react';
import { Camera, Search, X } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';

interface NavbarProps {
  onSearch: (query: string) => void;
  currentQuery?: string;
}

export default function Navbar({ onSearch, currentQuery = '' }: NavbarProps) {
  const [searchInput, setSearchInput] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleClear = () => {
    setSearchInput('');
    onSearch('');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Evren&apos;s Gallery
              </h1>
            </div>
          </Link>

          {/* Tüm ekranlarda görünen arama çubuğu */}
          <form 
            onSubmit={handleSubmit}
            className="flex-1 max-w-2xl"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Fotoğraf ara... (örn: doğa, şehir)"
                className="w-full pl-12 pr-10 py-3 text-gray-700 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Aramayı temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* GitHub Linki */}
          <div className="flex items-center justify-center flex-shrink-0">
            <a
              href="https://github.com/evrnzhn04"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-700 shadow-md transition-all duration-300 hover:scale-110"
              aria-label="GitHub profili"
            >
              <FaGithub size={28} className="text-white transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"/>
              <span className="hidden sm:inline-block absolute -bottom-8 text-xs font-bold text-gray-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

