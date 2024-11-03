import { create } from 'zustand';

interface UserState {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
}));

export default useUserStore;