// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Create a noop storage
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Get storage that works on both client and server
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage();

interface CartProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // تم إعادة التسمية من image إلى imageUrl
}

interface CartState {
  items: CartProduct[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const existingProduct = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const product = state.items.find((item) => item.productId === action.payload.productId);
      if (product && action.payload.quantity > 0) {
        product.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

const persistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'], // Only persist items array
};

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const cartReducer = persistReducer(persistConfig, cartSlice.reducer);
