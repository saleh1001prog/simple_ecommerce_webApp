import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // استخدام localStorage

// إعدادات redux-persist
const persistConfig = {
  key: 'cart', // حدد مفتاح التخزين ليكون "cart" فقط
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer, // استخدام persistedCartReducer لتخزين بيانات cart
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// إنشاء persistor
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null;

