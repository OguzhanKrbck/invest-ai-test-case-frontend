import { setBooks, setUsers } from './objectCacheSlice';

// Thunk function that fetches books
export const fetchBooks = () => async (dispatch) => {
  try {
    const response = await fetch('api/books');
    const data = await response.json();
    dispatch(setBooks(data?.payload));
  } catch (error) {
    console.error('Error occurred while fetching books:', error);
  }
};

// Thunk function that fetches users
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await fetch('api/users');
    const data = await response.json();
    dispatch(setUsers(data?.payload));
  } catch (error) {
    console.error('Error occurred while fetching users:', error);
  }
}; 