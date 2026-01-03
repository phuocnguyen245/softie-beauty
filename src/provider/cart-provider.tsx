// src/providers/counter-store-provider.tsx
"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import { type CartState, createCartStore } from "@/store/cart-store";

export type CartStoreApi = ReturnType<typeof createCartStore>;

export const CartProviderContext = createContext<CartStoreApi | undefined>(
  undefined
);

export interface CartStoreProviderProps {
  children: ReactNode;
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const [store] = useState(() => createCartStore());
  return (
    <CartProviderContext.Provider value={store}>
      {children}
    </CartProviderContext.Provider>
  );
};

export const useCartStore = <T,>(selector: (store: CartState) => T): T => {
  const cartStoreContext = useContext(CartProviderContext);
  if (!cartStoreContext) {
    throw new Error(`useCartStore must be used within CartStoreProvider`);
  }

  return useStore(cartStoreContext, selector);
};
