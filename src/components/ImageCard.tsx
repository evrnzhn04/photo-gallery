// src/components/ImageCard.tsx
'use client';

import Image from 'next/image';
import { UnsplashPhoto } from '@/lib/unsplash';
import { Heart, Download } from 'lucide-react';
import { useState } from 'react';

interface ImageCardProps {
  photo: UnsplashPhoto;
  onClick: () => void;
}

export default function ImageCard({ photo, onClick }: ImageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
      // Hata durumunda yeni sekmede aç
      window.open(photo.urls.full, '_blank');
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
      onClick={onClick}
    >
      {/* Skeleton Loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}

      {/* Ana Fotoğraf */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash photo'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Alt Bilgiler */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
              <Image
                src={photo.user.profile_image.medium}
                alt={photo.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {photo.user.name}
              </p>
              <p className="text-white/70 text-xs truncate">
                @{photo.user.username}
              </p>
            </div>
          </div>
        </div>

        {/* Üst Bilgiler - Hover */}
        <div className="absolute top-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-white text-sm font-medium">
                {photo.likes.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
              title="Fotoğrafı İndir"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}