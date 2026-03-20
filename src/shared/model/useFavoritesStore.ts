import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../lib/mmkvStorage';

interface FavoritesState {
  favorites: Record<number, boolean>;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (id) => {
        const { favorites } = get();
        set({
          favorites: {
            ...favorites,
            [id]: !favorites[id],
          },
        });
      },
      isFavorite: (id) => {
        return !!get().favorites[id];
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
