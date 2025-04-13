import { User } from "@/api/actions/auth/auth.types";
import { create } from "zustand";

type UserStore = {
  authData: null | {
    token: string;
    user: User;
  };
  setAuthData: (authData: { token: string; user: User }) => void;
};

const useUser = create<UserStore>((set) => ({
  authData: null,
  setAuthData: (authData: { token: string; user: User }) => set({ authData }),
}));

export default useUser;
