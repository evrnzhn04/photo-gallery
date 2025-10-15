// src/lib/unsplash.ts

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  created_at: string;
  width: number;
  height: number;
}

export async function getPhotos(page: number = 1, perPage: number = 12): Promise<UnsplashPhoto[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/photos?page=${page}&per_page=${perPage}&order_by=popular`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
        next: { revalidate: 3600 }, // 1 saat cache
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}

export async function searchPhotos(query: string, page: number = 1, perPage: number = 12): Promise<UnsplashPhoto[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&order_by=relevant`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
        next: { revalidate: 3600 }, // 1 saat cache
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search photos');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching photos:', error);
    return [];
  }
}