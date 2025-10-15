// src/components/ImageModal.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { UnsplashPhoto } from '@/lib/unsplash';
import { X, Heart, Download, Calendar, ExternalLink, Eye } from 'lucide-react';

interface ImageModalProps {
  photo: UnsplashPhoto;
  onClose: () => void;
}

export default function ImageModal({ photo, onClose }: ImageModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `unsplash-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('İndirme hatası:', error);
      window.open(photo.urls.full, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all z-10 group"
        aria-label="Kapat"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform" />
      </button>

      {/* Modal Content */}
      <div 
        className="relative w-full h-full sm:w-[95vw] sm:h-[92vh] sm:max-w-7xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="relative flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden lg:min-h-[700px]">
            <div className="relative w-full h-full">
              <Image
                src={photo.urls.regular}
                alt={photo.alt_description || 'Photo'}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 70vw"
                priority
              />
            </div>
            
            {/* Gradient Overlay for Mobile */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                  <Image
                    src={photo.user.profile_image.medium}
                    alt={photo.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {photo.user.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    @{photo.user.username}
                  </p>
                </div>
                <a
                  href={`https://unsplash.com/@${photo.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Unsplash profiline git"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>

              {/* Description */}
              {photo.alt_description && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {photo.alt_description}
                  </p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-current" />
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 text-center">
                    {photo.likes.toLocaleString()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-0.5">
                    Beğeni
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 text-center">
                    {photo.width} × {photo.height}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-0.5">
                    Boyut
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center leading-tight">
                    {formatDate(photo.created_at)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-0.5">
                    Tarih
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 transition-all text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Fotoğrafı </span>İndir
                </button>

                <a
                  href={`https://unsplash.com/photos/${photo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition-all text-sm sm:text-base"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Görüntüle</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}