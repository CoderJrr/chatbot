//Redux store'un ana dosyasıdır.ChatSlice ve API slice'ı burada birleştirilir.
//Tüm uygulama için merkezi state yönetimi sağlar.

import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './ChatSlice'; // ✅ doğru path olduğundan emin ol
import { localApi } from '../api/api'; // eğer RTK Query varsa

export const store = configureStore({
  reducer: {
    chat: chatReducer,        // ✅ burada 'chat' adında kayıtlı olmalı
    [localApi.reducerPath]: localApi.reducer, // RTK Query için
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localApi.middleware),
});
