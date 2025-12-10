import { createContext, useContext, useState, type Dispatch, type ReactNode } from "react";
import Cookies from "universal-cookie";

export type LoggedInUser = {
  id: number;
  username: string;
  role: string;
  accessToken: string;
};

export type LoggedInUserContextType = {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: Dispatch<React.SetStateAction<LoggedInUser | null>>;
};

const LoggedInUserContext = createContext<LoggedInUserContextType | null>(null);

export const LoggedInUserContextProvider = ({ children }: { children: ReactNode }) => {
  const cookies = new Cookies();
  const userCookie = cookies.get("loggedInUser");
  
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(userCookie || null);

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

export function useLoggedInUsersContext() {
  const context = useContext(LoggedInUserContext);
  if (!context) throw Error("Context hatası!");
  return context;
}