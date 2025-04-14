import { User } from "@/api/actions/auth/auth.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStore = {
  authData: null | {
    token: string;
    user: User;
  };

  setAuthData: (authData: null | { token: string; user: User }) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      authData: null,
      setAuthData: (authData: null | { token: string; user: User }) =>
        set({ authData }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
