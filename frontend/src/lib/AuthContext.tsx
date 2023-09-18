import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import * as SecureStorage from "expo-secure-store";
import { BackEndConnection } from "../api/BackendConnection";

export interface User {
  email: string;
  token: string;
  role: "STANDARD" | "MEDIC_CENTRAL" | "TRYGGHETSJOUR" | "AMBULANCE_DRIVER";
}

interface UserType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  getUser: () => Promise<User | null>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext({} as UserType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async (): Promise<User | null> => {
    const _user = await SecureStorage.getItemAsync("user");
    return _user === null ? null : JSON.parse(_user);
  };

  const saveUser = async (_user: User | null) => {
    if (_user) {
      await SecureStorage.setItemAsync("user", JSON.stringify(_user));
    } else {
      await SecureStorage.setItemAsync("user", "");
    }
    setUser(_user);
  };

  const login = useCallback(async (email: string, password: string) => {
    await BackEndConnection.signIn(email, password)
      .then(async (_user: User) => {
        await saveUser(_user);
      })
      .catch((error: any) => {
        let message = "Internal server error. Please try again later.";
        if (error.errorCode === 404) {
          error.reponse = "User not found.";
        } else if (error.response && error.response.status === 401) {
          message = "Wrong password.";
        }
        throw new Error(message);
      });
  }, []);

  const logout = useCallback(async () => {
    await saveUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: saveUser,
      getUser,
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //children Hela applicationen
};
