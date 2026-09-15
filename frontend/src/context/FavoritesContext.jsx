import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { favoriteService } from "../services/shopService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const data = await favoriteService.list();
    setFavorites(data);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorited = (productId) => favorites.some((f) => f.product === productId);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast?.push("Sevimlilarga qo'shish uchun tizimga kiring", "error");
      return;
    }
    const existing = favorites.find((f) => f.product === productId);
    if (existing) {
      await favoriteService.remove(existing.id);
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      toast?.push("Sevimlilardan o'chirildi", "info");
    } else {
      const data = await favoriteService.add(productId);
      setFavorites((prev) => [...prev, data]);
      toast?.push("Sevimlilarga qo'shildi");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, refresh, isFavorited, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
