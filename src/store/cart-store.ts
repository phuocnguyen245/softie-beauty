import { Product } from "@/types";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartState = {
  cart: Product[];
  isCartOpen: boolean;
  toggleCart: () => void;
  updateQuantity: (product: Product, quantity: number) => void;
  getSubtotal: () => number;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
};

export type CounterActions = {
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
};

export type CounterStore = CartState & CounterActions;

const calculateTotal = (price: number, quantity: number): number => {
  return Number(price) * quantity;
};

const updateProductQuantity = (
  product: Product,
  quantity: number
): Product => ({
  ...product,
  cartQuantity: quantity,
  total: calculateTotal(product.price, quantity),
});

export const defaultInitState: CartState = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  isCartOpen: false,
  toggleCart: () => {},
  updateQuantity: () => {},
  getSubtotal: () => 0,
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartState>()(
    persist(
      (set, get) => ({
        ...initState,
        addToCart: (product: Product) =>
          set((state) => {
            // For products with variants, treat each variant as a separate cart item
            const existingIndex = state.cart.findIndex(
              (item) =>
                item.id === product.id &&
                item.selectedVariant === product.selectedVariant
            );

            if (existingIndex >= 0) {
              const existingProduct = state.cart[existingIndex];
              const newQuantity = (existingProduct.cartQuantity ?? 0) + 1;
              const updatedCart = [...state.cart];
              updatedCart[existingIndex] = updateProductQuantity(
                existingProduct,
                newQuantity
              );
              return { cart: updatedCart };
            }

            return {
              cart: [...state.cart, updateProductQuantity(product, 1)],
            };
          }),
        removeFromCart: (product: Product) =>
          set((state) => ({
            cart: state.cart.filter(
              (item) =>
                !(
                  item.id === product.id &&
                  item.selectedVariant === product.selectedVariant
                )
            ),
          })),
        toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
        updateQuantity: (product: Product, quantity: number) =>
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === product.id &&
              item.selectedVariant === product.selectedVariant
                ? updateProductQuantity(item, quantity)
                : item
            ),
          })),
        getSubtotal: () => {
          const state = get();
          return state.cart.reduce(
            (acc, item) =>
              acc + calculateTotal(item.price, item.cartQuantity ?? 0),
            0
          );
        },
      }),
      {
        name: "softie-beauty-cart",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          cart: state.cart,
        }),
      }
    )
  );
};
