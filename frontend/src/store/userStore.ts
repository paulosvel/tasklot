import { create } from 'zustand';

interface UserState {
  currentUserId: string | null;
  currentUserEmail: string | null;
  teamId: string | null;
  teams: Array<{ id: string; name: string }>;
  setCurrentUserId: (id: string | null) => void;
  setCurrentUserEmail: (email: string | null) => void;
  setTeamId: (id: string | null) => void;
  setTeams: (teams: Array<{ id: string; name: string }>) => void;
}

const useUserStore = create<UserState>((set) => ({
  currentUserId: null,
  currentUserEmail: null,
  teamId: null,
  teams: [],
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setCurrentUserEmail: (email) => set({ currentUserEmail: email }),
  setTeamId: (id) => set({ teamId: id }),
  setTeams: (teams) => set({ teams }),
}));

export default useUserStore;