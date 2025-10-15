// src/app/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getPhotos, searchPhotos, UnsplashPhoto } from '@/lib/unsplash';
import ImageCard from '@/components/ImageCard';
import ImageModal from '@/components/ImageModal';
import Navbar from '@/components/Navbar';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export default function Home() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  // Infinity Scroll - Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, searchQuery]);

  const loadPhotos = async () => {
    setLoading(true);
    const data = await getPhotos(1, 12);
    setPhotos(data);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    if (!query.trim()) {
      // Arama temizlendi, normal fotoğrafları yükle
      const data = await getPhotos(1, 12);
      setPhotos(data);
      setLoading(false);
      return;
    }

    // Arama yap
    const data = await searchPhotos(query, 1, 12);
    setPhotos(data);
    setLoading(false);
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    let data: UnsplashPhoto[];
    if (searchQuery) {
      data = await searchPhotos(searchQuery, nextPage, 12);
    } else {
      data = await getPhotos(nextPage, 12);
    }
    
    if (data.length === 0) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }
    
    // Duplicate kontrolü - sadece yeni fotoğrafları ekle
    const existingIds = new Set(photos.map(p => p.id));
    const newPhotos = data.filter(photo => !existingIds.has(photo.id));
    
    setPhotos(prev => [...prev, ...newPhotos]);
    setPage(nextPage);
    setLoadingMore(false);
  }, [page, photos, loadingMore, hasMore, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar */}
      <Navbar onSearch={handleSearch} currentQuery={searchQuery} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Query Header */}
        {searchQuery && !loading && (
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <SearchIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                "{searchQuery}" için sonuçlar
              </h2>
            </div>
            <p className="text-gray-500 ml-12">
              {photos.length} fotoğraf bulundu
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? 'Aranıyor...' : 'Fotoğraflar yükleniyor...'}
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="p-4 rounded-full bg-gray-100">
              <SearchIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              "{searchQuery}" için hiçbir fotoğraf bulunamadı. Başka bir arama terimi deneyin.
            </p>
          </div>
        ) : (
          <>
            {/* Photo Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {photos.map((photo) => (
                <ImageCard
                  key={photo.id}
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                />
              ))}
            </div>

            {/* Infinity Scroll Trigger */}
            <div 
              ref={observerTarget} 
              className="mt-12 flex justify-center py-8"
            >
              {loadingMore && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-gray-500 text-sm font-medium">
                    Daha fazla fotoğraf yükleniyor...
                  </p>
                </div>
              )}
              
              {!hasMore && photos.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-medium">
                    Tüm fotoğraflar yüklendi 🎉
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Image Modal */}
      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}