import { configureStore } from '@reduxjs/toolkit';
import objectCacheReducer from './objectCacheSlice';

export const store = configureStore({
  reducer: {
    objectCache: objectCacheReducer
  }
}); 