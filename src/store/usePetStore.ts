import { create } from 'zustand';
import { Pet } from '../types';

interface PetStore {
  pet: Pet | null;
  todaysInteractions: number;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  
  setPet: (pet: Pet) => void;
  setTodaysInteractions: (count: number) => void;
  setOnline: (online: boolean) => void;
  incrementInteraction: () => void;
  resetDailyInteractions: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 模拟宠物数据 - 根据Figma设计稿
const mockPet: Pet = {
  id: 'pet-1',
  user_id: 'user-1',
  name: '肉派派',
  personality: '暴躁狂',
  growth_stage: '认知形成期',
  companionship_days: 360,
  daily_interactions: 280,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const usePetStore = create<PetStore>((set) => ({
  pet: mockPet,
  todaysInteractions: 280,
  isOnline: true,
  isLoading: false,
  error: null,

  setPet: (pet) => set({ pet }),
  setTodaysInteractions: (count) => set({ todaysInteractions: count }),
  setOnline: (isOnline) => set({ isOnline }),
  incrementInteraction: () => set((state) => ({ 
    todaysInteractions: state.todaysInteractions + 1 
  })),
  resetDailyInteractions: () => set({ todaysInteractions: 0 }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
