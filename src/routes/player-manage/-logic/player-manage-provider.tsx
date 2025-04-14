import { createContext, useContext } from "react";

export type PlayerManageContextType = {};

export const PlayerManageContext = createContext<PlayerManageContextType>({});

export function PlayerManageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerManageContext.Provider value={{}}>
      {children}
    </PlayerManageContext.Provider>
  );
}

export function usePlayerManage() {
  return useContext(PlayerManageContext);
}
