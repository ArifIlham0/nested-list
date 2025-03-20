import {create} from 'zustand';
import api from '../services/api';

interface CategoryState {
  isLoading: boolean;
  message: string | null;
  error: boolean;
  categories: string[];
  jokes: Joke[];
  fetchCategories: () => Promise<void>;
  fetchJokes: (category: string) => Promise<void>;
}

const useCategoryStore = create<CategoryState>(set => ({
  isLoading: false,
  message: null,
  error: false,
  categories: [],
  jokes: [],

  fetchCategories: async () => {
    try {
      set({isLoading: true, message: null});
      const response = await api.get('/categories');
      set({categories: response.data.categories});
    } catch (error: any) {
      set({message: error.message});
    } finally {
      set({isLoading: false});
    }
  },

  fetchJokes: async (category: string) => {
    try {
      set({isLoading: true, message: null});
      const response = await api.get(`/joke/${category}?type=single&amount=2`);

      set({jokes: response.data.jokes});
      return response.data.jokes;
    } catch (error: any) {
      set({
        error: true,
        message: error.response?.data?.message,
      });
      return [];
    } finally {
      set({isLoading: false});
    }
  },
}));

export default useCategoryStore;
