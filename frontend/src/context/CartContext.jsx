import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { cartService } from "../services/shopService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total_price: 0 });
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.get();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast?.push("Savatchaga qo'shish uchun tizimga kiring", "error");
      return;
    }
    const data = await cartService.add(productId, quantity);
    setCart(data);
    toast?.push("Mahsulot savatchaga qo'shildi");
  };

  const updateQuantity = async (itemId, quantity) => {
    const data = await cartService.updateQuantity(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const data = await cartService.removeItem(itemId);
    setCart(data);
    toast?.push("Mahsulot savatchadan o'chirildi", "info");
  };

  const clearCart = async () => {
    await cartService.clear();
    setCart({ items: [], total_price: 0 });
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, refresh, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
