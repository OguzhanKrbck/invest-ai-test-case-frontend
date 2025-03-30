import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  users: []
};

export const objectCacheSlice = createSlice({
  name: 'objectCache',
  initialState,
  reducers: {
    // Books için reducerlar
    setBooks: (state, action) => {
      state.books.push(action.payload);
    },
    
    // Users için reducerlar
    setUsers: (state, action) => {
      state.users.push(action.payload);
    },
  }
});

export const { 
  setBooks,
  setUsers
} = objectCacheSlice.actions;

export default objectCacheSlice.reducer; 